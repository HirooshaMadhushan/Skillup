import { Router } from 'express';
import { AssignmentController } from '../controllers/assignment.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { assignmentUpload, submissionUpload } from '../middlewares/upload.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createAssignmentSchema, reviewSubmissionSchema } from '../utils/assignment.validation';

const router = Router();
const assignmentController = new AssignmentController();

/**
 * @swagger
 * /api/assignments:
 *   post:
 *     summary: Create a new assignment (Tutor only)
 *     tags: [Assignments]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/',
  authenticate,
  authorizeRoles(['TUTOR', 'ADMIN']),
  assignmentUpload.single('assignment'),
  validate(createAssignmentSchema),
  assignmentController.createAssignment
);

/**
 * @swagger
 * /api/assignments:
 *   get:
 *     summary: Get all assignments
 *     tags: [Assignments]
 */
router.get('/', assignmentController.getAssignments);

/**
 * @swagger
 * /api/assignments/{assignmentId}/submit:
 *   post:
 *     summary: Submit work for an assignment (Learner only)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/:assignmentId/submit',
  authenticate,
  authorizeRoles(['LEARNER']),
  submissionUpload.single('submission'),
  assignmentController.submitWork
);

/**
 * @swagger
 * /api/assignments/{assignmentId}/submissions:
 *   get:
 *     summary: Get all submissions for an assignment (Tutor only)
 *     tags: [Submissions]
 *     security:
 *       - bearerAuth: []
 */
router.get(
  '/:assignmentId/submissions',
  authenticate,
  authorizeRoles(['TUTOR', 'ADMIN']),
  assignmentController.getSubmissions
);

/**
 * @swagger
 * /api/submissions/{submissionId}/review:
 *   post:
 *     summary: Review and grade a submission (Tutor only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/submissions/:submissionId/review',
  authenticate,
  authorizeRoles(['TUTOR', 'ADMIN']),
  validate(reviewSubmissionSchema),
  assignmentController.reviewSubmission
);

export default router;
