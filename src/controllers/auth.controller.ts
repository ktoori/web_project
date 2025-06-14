import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../models/db';

export const register = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  await pool.query('INSERT INTO users(email, password, role) VALUES($1, $2, $3)', [email, hashed, role]);
  res.json({ message: 'Registered' });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email]);

  if (result.rows.length === 0) {
    res.status(401).json({ message: 'User not found' });
    return;
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    res.status(401).json({ message: 'Invalid password' });
    return;
  }

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '7d' });
  res.json({ token });
};