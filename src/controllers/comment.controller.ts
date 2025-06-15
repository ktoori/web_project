import { Request, Response } from 'express';
import pool from '../models/db';
import multer from 'multer';
import path from 'path';

// Папка для файлов (создай uploads в корне проекта!)
const upload = multer({
  dest: path.join(__dirname, '../../uploads/'),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadMiddleware = upload.single('file');

// --- КОММЕНТАРИИ ---

export const addComment = async (req: Request, res: Response) => {
  const { text, user_email } = req.body;
  const material_id = req.params.id;
  let file_path = null;

  const file = (req as any).file;
  if (file) {
    file_path = file.filename;
  }

  await pool.query(
    "INSERT INTO comments(material_id, user_email, text, file_path) VALUES($1, $2, $3, $4)",
    [material_id, user_email, text, file_path]
  );
  res.json({ message: "Комментарий добавлен" });
};

export const getComments = async (req: Request, res: Response) => {
  const material_id = req.params.id;
  const result = await pool.query(
    "SELECT * FROM comments WHERE material_id=$1 ORDER BY created_at DESC",
    [material_id]
  );
  res.json(result.rows);
};
