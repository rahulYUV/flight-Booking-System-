import express from 'express';
import { getFlights, createFlight, getFlightById, updateFlight, deleteFlight, searchTrips, getAirports, getStats } from '../controllers/flightController';
import { getLiveStatus } from '../controllers/liveFlightController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { updateFlightSchema, createFlightSchema } from '../validators';

const router = express.Router();

router.get('/airports', getAirports);
router.get('/stats', getStats);

/**
 * @swagger
 * /api/flights/live/{flightNumber}:
 *   get:
 *     summary: Track a flight in real-time (Aviationstack Integration)
 *     parameters:
 *       - in: path
 *         name: flightNumber
 *         required: true
 *         description: IATA Flight Number (e.g., 6E2134)
 */
router.get('/live/:flightNumber', getLiveStatus);

/**
 * @swagger
 * /api/flights/search-trips:
 *   get:
 *     summary: Advanced Search for Trips (One-way or Round-trip)
 *     parameters:
 *       - in: query
 *         name: source
 *         required: true
 *       - in: query
 *         name: destination
 *         required: true
 *       - in: query
 *         name: departureDate
 *         required: true
 *       - in: query
 *         name: returnDate
 *         description: If provided, logic becomes Round-trip
 */
router.get('/search-trips', searchTrips);

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
router.route('/').get(getFlights).post(protect, validate(createFlightSchema), createFlight);

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
