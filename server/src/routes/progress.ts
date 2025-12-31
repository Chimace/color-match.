import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_candy_match_key_12345';

// Extend Request type to include userId
interface AuthenticatedRequest extends Request {
    userId?: string;
}

const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.userId = payload.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

router.post('/save', authenticate, async (req: AuthenticatedRequest, res: Response) => {
    const { levelId, score, stars } = req.body;

    try {
        const progress = await prisma.levelProgress.upsert({
            where: {
                userId_levelId: {
                    userId: req.userId!,
                    levelId,
                },
            },
            update: {
                score: { set: score },
                stars: { set: stars },
                completedAt: new Date(),
            },
            create: {
                userId: req.userId!,
                levelId,
                score,
                stars,
            },
        });
        res.json(progress);
    } catch (error) {
        console.error('Save Progress Error:', error);
        res.status(500).json({ error: 'Failed to save progress' });
    }
});

router.get('/', authenticate, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const progress = await prisma.levelProgress.findMany({
            where: { userId: req.userId },
        });
        res.json(progress);
    } catch (error) {
        console.error('Fetch Progress Error:', error);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

export default router;
