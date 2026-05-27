import { Router } from 'express';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @example Protected Route
 * Accessible by any authenticated user (Learner, Tutor, or Admin)
 */
router.get('/profile', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'User profile data',
    user: (req as any).user, // Using AuthRequest for typing in real implementation
  });
});

/**
 * @example Tutor-Only Route
 * Accessible only by users with the TUTOR role
 */
router.get('/tutor/dashboard', authenticate, authorizeRoles(['TUTOR']), (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Tutor Dashboard',
  });
});

/**
 * @example Admin-Only Route
 * Accessible only by users with the ADMIN role
 */
router.get('/admin/users', authenticate, authorizeRoles(['ADMIN']), (req, res) => {
  res.json({
    success: true,
    message: 'Admin: List of all users',
  });
});

/**
 * @example Multi-Role Route
 * Accessible by either Tutor or Admin
 */
router.get('/reports', authenticate, authorizeRoles(['TUTOR', 'ADMIN']), (req, res) => {
  res.json({
    success: true,
    message: 'Management reports',
  });
});

export default router;
