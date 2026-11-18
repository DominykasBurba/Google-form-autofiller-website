import { Router } from 'express';
import { guides } from './content.js';

export const guideRoutes = Router();

guideRoutes.get('/', (_req, res) => res.json({ guides }));
guideRoutes.get('/:id', (req, res) => {
  const guide = guides.find(({ id }) => id === req.params.id);
  if (!guide) return res.status(404).json({ error: 'Guide not found.' });
  res.json({ guide });
});
