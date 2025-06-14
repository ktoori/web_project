import express from 'express';
import {
  createMaterial,
  getAllMaterials,
  updateMaterial,
  deleteMaterial
} from '../controllers/material.controller';

import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getAllMaterials);
router.post('/', authMiddleware(['admin']), createMaterial);
router.put('/:id', authMiddleware(['admin']), updateMaterial);
router.delete('/:id', authMiddleware(['admin']), deleteMaterial);

export default router;