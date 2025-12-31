"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_candy_match_key_12345';
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = payload.userId;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};
router.post('/save', authenticate, async (req, res) => {
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
                score: { set: score },
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
    }
    catch (error) {
        console.error('Save Progress Error:', error);
        res.status(500).json({ error: 'Failed to save progress' });
    }
});
router.get('/', authenticate, async (req, res) => {
    try {
        const progress = await prisma.levelProgress.findMany({
            where: { userId: req.userId },
        });
        res.json(progress);
    }
    catch (error) {
        console.error('Fetch Progress Error:', error);
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
});
exports.default = router;
