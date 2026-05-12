import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
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

app.listen(PORT, () => {
  console.log(`PoliceWatch API running on port ${PORT}`);
});

export default app;
