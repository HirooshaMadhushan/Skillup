import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();
const analyticsController = new AnalyticsController();

/**
 * @swagger
 * /api/analytics/tutor:
 *   get:
 *     summary: Get tutor-specific analytics (Earnings, Stats)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/tutor',
  authenticate,
  authorizeRoles(['TUTOR', 'ADMIN']),
  analyticsController.getTutorStats
);

/**
 * @swagger
 * /api/analytics/learner:
 *   get:
 *     summary: Get learner-specific progress analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/learner',
  authenticate,
  authorizeRoles(['LEARNER', 'ADMIN']),
  analyticsController.getLearnerProgress
);

/**
 * @swagger
 * /api/analytics/platform:
 *   get:
 *     summary: Get overall platform analytics (Admin only)
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/platform',
  authenticate,
  authorizeRoles(['ADMIN']),
  analyticsController.getPlatformStats
);

export default router;
