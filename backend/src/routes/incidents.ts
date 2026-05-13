import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../db/client';
import { videoUpload } from '../middleware/upload';
import { uploadVideo } from '../services/spaces';
import { extractFrames } from '../services/ffmpeg';
import { validateIncident } from '../services/aiValidation';
import { notifyPendingReview } from '../services/email';
import { submitLimiter } from '../middleware/rateLimiter';
import { VIOLATION_TYPES } from '../types/incident';

const router = Router();

const CreateIncidentSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  address: z.string().min(1).max(500),
  violationType: z.enum(VIOLATION_TYPES),
  vehicleDesc: z.string().max(500).optional(),
  incidentAt: z.string().datetime(),
  recorderSpeed: z.coerce.number().min(0).max(200).optional(), // m/s — recorder's speed, not violating vehicle
});

router.post('/', submitLimiter, videoUpload.single('video'), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: 'Video file is required.' });
    return;
  }

  const parsed = CreateIncidentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid fields.', details: parsed.error.flatten() });
    return;
  }

  const data = parsed.data;

  const videoUrl = await uploadVideo(req.file.buffer, req.file.originalname, req.file.mimetype);

  const frames = await extractFrames(req.file.buffer);
  const aiResult = await validateIncident(frames, data.violationType);

  const status =
    aiResult.confidence === 'confirmed'
      ? 'PUBLISHED'
      : aiResult.confidence === 'uncertain'
      ? 'PENDING_REVIEW'
      : 'REJECTED';

  const incident = await prisma.incident.create({
    data: {
      videoUrl,
      latitude: data.latitude,
      longitude: data.longitude,
      address: data.address,
      violationType: data.violationType,
      vehicleDesc: data.vehicleDesc,
      recorderSpeed: data.recorderSpeed,
      incidentAt: new Date(data.incidentAt),
      aiConfidence: aiResult.confidence,
      aiReasoning: aiResult.reasoning,
      status,
    },
  });

  if (status === 'PENDING_REVIEW') {
    notifyPendingReview(incident.id, data.violationType, data.address).catch(() => {});
  }

  res.status(201).json({
    id: incident.id,
    status: incident.status,
    message:
      status === 'PUBLISHED'
        ? 'Incident confirmed and published to the map.'
        : status === 'PENDING_REVIEW'
        ? 'Incident flagged for human review.'
        : 'Video did not clearly show the stated violation.',
  });
});

router.get('/', async (req: Request, res: Response) => {
  const sinceRaw = req.query.since as string | undefined;
  const since = sinceRaw ? new Date(sinceRaw) : undefined;
  const sinceFilter = since && !isNaN(since.getTime()) ? { incidentAt: { gte: since } } : {};

  const incidents = await prisma.incident.findMany({
    where: { status: 'PUBLISHED', ...sinceFilter },
    select: {
      id: true,
      latitude: true,
      longitude: true,
      address: true,
      violationType: true,
      vehicleDesc: true,
      recorderSpeed: true,
      incidentAt: true,
      videoUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
  res.json(incidents);
});

router.get('/patterns', async (_req: Request, res: Response) => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [total, thisMonth, byType, hotSpots] = await Promise.all([
    prisma.incident.count({ where: { status: 'PUBLISHED' } }),
    prisma.incident.count({ where: { status: 'PUBLISHED', createdAt: { gte: startOfMonth } } }),
    prisma.incident.groupBy({
      by: ['violationType'],
      where: { status: 'PUBLISHED' },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),
    prisma.incident.groupBy({
      by: ['address'],
      where: { status: 'PUBLISHED' },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    }),
  ]);

  res.json({
    total,
    thisMonth,
    byType: byType.map((r) => ({ violationType: r.violationType, count: r._count.id })),
    hotSpots: hotSpots
      .filter((r) => r._count.id >= 2)
      .map((r) => ({ address: r.address, count: r._count.id })),
  });
});

router.get('/:id', async (req: Request, res: Response) => {
  const incident = await prisma.incident.findUnique({
    where: { id: req.params.id, status: 'PUBLISHED' },
  });
  if (!incident) {
    res.status(404).json({ error: 'Incident not found.' });
    return;
  }
  res.json(incident);
});

export default router;
