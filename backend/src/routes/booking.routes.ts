import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authenticate, authorizeRoles } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createBookingSchema, updateBookingStatusSchema } from '../utils/booking.validation';

const router = Router();
const bookingController = new BookingController();

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Book a session with a tutor
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  '/',
  authenticate,
  authorizeRoles(['LEARNER']),
  validate(createBookingSchema),
  bookingController.bookSession
);

/**
 * @swagger
 * /api/bookings/me:
 *   get:
 *     summary: Get my upcoming and past bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', authenticate, bookingController.getMyBookings);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   post:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/cancel', authenticate, bookingController.cancelBooking);

/**
 * @swagger
 * /api/bookings/{id}/status:
 *   patch:
 *     summary: Update booking status (Tutor only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 */
router.patch(
  '/:id/status',
  authenticate,
  authorizeRoles(['TUTOR', 'ADMIN']),
  validate(updateBookingStatusSchema),
  bookingController.updateStatus
);

export default router;
