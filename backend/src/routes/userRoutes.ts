import express from 'express';
import { registerUser, authUser, getUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { signupSchema, loginSchema } from '../validators';

const router = express.Router();

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation Error (Zod)
 */
router.post('/signup', validate(signupSchema), registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Authenticate User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login Successful (Token Provided)
 */
router.post('/login', validate(loginSchema), authUser);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile Data Returned
 */
router.route('/profile').get(protect, getUserProfile);

export default router;
