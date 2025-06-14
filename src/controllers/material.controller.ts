import { Request, Response } from 'express';
import pool from '../models/db';

export const getAllMaterials = async (_: Request, res: Response) => {
  const result = await pool.query('SELECT * FROM materials ORDER BY date DESC');
  res.json(result.rows);
};

export const createMaterial = async (req: Request, res: Response) => {
  const { subject, lecturer, title, content, homework, date, homework_due } = req.body;
  await pool.query(
    'INSERT INTO materials(subject, lecturer, title, content, homework, date, homework_due) VALUES($1, $2, $3, $4, $5, $6, $7)',
    [subject, lecturer, title, content, homework, date, homework_due]
  );
  res.json({ message: 'Material created' });
};

export const updateMaterial = async (req: Request, res: Response) => {
  const id = req.params.id;
  const { subject, lecturer, title, content, homework, date, homework_due } = req.body;
  await pool.query(
    'UPDATE materials SET subject=$1, lecturer=$2, title=$3, content=$4, homework=$5, date=$6, homework_due=$7 WHERE id=$8',
    [subject, lecturer, title, content, homework, date, homework_due, id]
  );
  res.json({ message: 'Material updated' });
};

export const deleteMaterial = async (req: Request, res: Response) => {
  const id = req.params.id;
  await pool.query('DELETE FROM materials WHERE id=$1', [id]);
  res.json({ message: 'Material deleted' });
};