"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_candy_match_key_12345';
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                username,
                passwordHash: hashedPassword,
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
        res.json({ token, user: { id: user.id, username: user.username } });
    }
    catch (error) {
        console.error('Registration Error:', error);
        if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
            res.status(400).json({ error: 'Username already exists' });
        }
        else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!valid) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET);
        res.json({ token, user: { id: user.id, username: user.username } });
    }
    catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
