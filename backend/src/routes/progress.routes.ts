import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const progressController = new ProgressController();

/**
 * @swagger
 * /api/progress/view/{lessonId}:
 *   post:
 *     summary: Track a lesson view
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 */
router.post('/view/:lessonId', authenticate, progressController.trackView);

/**
 * @swagger
 * /api/progress/complete/{lessonId}:
 *   post:
 *     summary: Mark a lesson as completed
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 */
router.post('/complete/:lessonId', authenticate, progressController.markAsCompleted);

export default router;
