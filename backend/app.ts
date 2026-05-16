import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './src/modules/auth/auth.routes';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Equilibria API', timestamp: new Date().toISOString() });
});

// Módulos
app.use('/api/auth', authRoutes);

export default app;
