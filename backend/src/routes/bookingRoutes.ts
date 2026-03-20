import express from 'express';
import { createBooking, getMyBookings, cancelBooking } from '../controllers/bookingController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { bookingSchema } from '../validators';

const router = express.Router();

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Fetch all personal bookings
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns booking list populated with flight details
 *   post:
 *     summary: Book a flight
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flightId:
 *                 type: string
 *               passengerName:
 *                 type: string
 *               seatNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking processed successfully
 *       400:
 *         description: Seats full OR Invalid Validation Payload via Zod
 */
router.route('/')
  .post(protect, validate(bookingSchema), createBooking)
  .get(protect, getMyBookings);

/**
 * @swagger
 * /api/bookings/{id}/cancel:
 *   put:
 *     summary: Mark a confirmed booking successfully as Cancelled
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Seat refunded to Flight pool securely.
 *       400:
 *         description: Booking logic rejection (Already Cancelled flag)
 */
router.put('/:id/cancel', protect, cancelBooking);

export default router;
