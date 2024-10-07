import express from 'express';
import authenticationRoutes from './authentication.route';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

// Public route for login and signup
router.use('/auth', authenticationRoutes);

// Protected route
router.get('/protected', authenticate, (req, res) => {
    res.send({ message: 'This is a protected route' });
});

export default router;
