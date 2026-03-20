import express from 'express';
import { getFlights, createFlight, getFlightById, updateFlight, deleteFlight } from '../controllers/flightController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { updateFlightSchema } from '../validators';

const router = express.Router();

/**
 * @swagger
 * /api/flights:
 *   get:
 *     summary: Fetch all available flights (accepts search queries)
 *     parameters:
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Departure location
 *       - in: query
 *         name: destination
 *         schema:
 *           type: string
 *         description: Arrival location
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Specific date (YYYY-MM-DD)
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *         description: Filter flights strictly below or at this price
 *       - in: query
 *         name: minSeats
 *         schema:
 *           type: integer
 *         description: Ensure flight has at least this many available seats
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Sort formatting (e.g., price:asc or price:desc)
 *     responses:
 *       200:
 *         description: Array of flight objects
 *   post:
 *     summary: Add a new flight to the schedule
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Flight generated successfully
 */
router.route('/').get(getFlights).post(protect, createFlight);

/**
 * @swagger
 * /api/flights/{id}:
 *   get:
 *     summary: Fetch single flight by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Responds strictly with the specific flight object
 *   put:
 *     summary: Update flight data (Admin/Manager role typically)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Updates the flight safely (Zod Validated)
 *   delete:
 *     summary: Cancel a flight offering
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Flight officially removed from Mongo
 */
router.route('/:id')
  .get(getFlightById)
  .put(protect, validate(updateFlightSchema), updateFlight)
  .delete(protect, deleteFlight);

export default router;
