import { Router, Request, Response } from 'express';
import { prisma } from '../db/client';
import { adminAuth } from '../middleware/adminAuth';

const router = Router();

router.use(adminAuth);

router.get('/pending', async (_req: Request, res: Response) => {
  const incidents = await prisma.incident.findMany({
    where: { status: 'PENDING_REVIEW' },
    orderBy: { createdAt: 'asc' },
  });
  res.json(incidents);
});

router.patch('/:id/approve', async (req: Request, res: Response) => {
  const incident = await prisma.incident.update({
    where: { id: req.params.id },
    data: { status: 'PUBLISHED' },
  });
  res.json(incident);
});

router.patch('/:id/reject', async (req: Request, res: Response) => {
  const incident = await prisma.incident.update({
    where: { id: req.params.id },
    data: { status: 'REJECTED' },
  });
  res.json(incident);
});

export default router;
