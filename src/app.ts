import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import materialRoutes from './routes/material.routes';
import path from "path";
import commentRoutes from './routes/comment.routes';
const app = express();

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);

app.use('/api/materials', commentRoutes);

export default app;