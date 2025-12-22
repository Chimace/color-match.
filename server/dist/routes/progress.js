"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const authenticate = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token)
        return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
router.post('/save', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { levelId, score, stars } = req.body;
    try {
        const progress = yield prisma.levelProgress.upsert({
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
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to save progress' });
    }
}));
router.get('/', authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const progress = yield prisma.levelProgress.findMany({
            where: { userId: req.userId },
        });
        res.json(progress);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch progress' });
    }
}));
exports.default = router;
