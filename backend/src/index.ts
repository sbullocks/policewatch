import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { exiftool } from 'exiftool-vendored';
import incidentRoutes from './routes/incidents';
import adminRoutes from './routes/admin';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/incidents', incidentRoutes);
app.use('/api/admin', adminRoutes);

const server = app.listen(PORT, () => {
  console.log(`PoliceWatch API running on port ${PORT}`);
});

const shutdown = () => {
  exiftool.end();
  server.close();
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
