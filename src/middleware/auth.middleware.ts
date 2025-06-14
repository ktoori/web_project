import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (roles: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      if (roles.length && !roles.includes(decoded.role)) {
        res.status(403).json({ message: 'Forbidden' });
        return;
      }

      (req as any).user = decoded;
      next();
    } catch {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};