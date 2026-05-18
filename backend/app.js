import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173'
]
  .filter(Boolean)
  .flatMap((origin) => origin.split(',').map((item) => item.trim()))
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    const isAllowedRenderOrigin = origin?.endsWith('.onrender.com');

    if (!origin || allowedOrigins.includes(origin) || isAllowedRenderOrigin) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.options('*', cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'AI Employee Performance Analytics API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
