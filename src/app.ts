import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import materialRoutes from './routes/material.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);

export default app;