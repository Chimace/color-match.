import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const authenticate = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

router.post('/save', authenticate, async (req: any, res) => {
    const { levelId, score, stars } = req.body;
    try {
        const progress = await prisma.levelProgress.upsert({
            where: {
                userId_levelId: {
                    userId: req.userId,
                    levelId,
                },
            },
            update: {
                score: { set: score }, // Or keep max? Let's just update for now
                stars: { set: stars },
                completedAt: new Date(),
            },
            create: {
                userId: req.userId,
                levelId,
                score,
                stars,
            },
        });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save progress' });
    }
});

router.get('/', authenticate, async (req: any, res) => {
    try {
        const progress = await prisma.levelProgress.findMany({
            where: { userId: req.userId },
        });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});

export default router;
