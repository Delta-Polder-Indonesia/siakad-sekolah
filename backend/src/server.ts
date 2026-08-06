import cors    from 'cors';
import express from 'express';
import helmet  from 'helmet';
import { env }          from './config/env.js';
import { apiRouter }    from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = env.CLIENT_ORIGIN
  .split(',')
  .map((o) => o.trim());

app.use(helmet());
app.use(cors({
  origin:         allowedOrigins,
  credentials:    true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(express.json({ limit: '2mb' }));

app.get('/', (_req, res) => {
  res.json({ name: 'Absensi Sekolah API', version: '0.1.0' });
});

app.use('/api', apiRouter);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ ok: false, message: 'Endpoint tidak ditemukan.' });
});

// Error handler — HARUS paling bawah
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Backend berjalan di http://localhost:${env.PORT}`);
});