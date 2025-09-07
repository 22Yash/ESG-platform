"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../prisma");
const jwt_1 = require("../utils/jwt");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7
};
// signup
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, company, email, password } = req.body;
        // check if user exists
        const existing = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (existing)
            return res.status(400).json({ error: 'User already exists' });
        // hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // create user
        const user = await prisma_1.prisma.user.create({
            data: {
                firstName, // use firstName directly
                lastName,
                email,
                password: hashedPassword,
            },
        });
        // generate JWT
        const token = (0, jwt_1.signToken)({ userId: user.id });
        res.json({ user, token });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
// login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        const token = (0, jwt_1.signToken)({ userId: user.id });
        res.cookie("token", token, { httpOnly: true, secure: false });
        return res.json({ message: "Login successful", token });
    }
    catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});
// logout
router.post('/logout', (req, res) => {
    res.clearCookie('token', cookieOptions);
    res.json({ ok: true });
});
// me (protected)
router.get('/me', auth_1.authMiddleware, async (req, res) => {
    try {
        const user = await prisma_1.prisma.user.findUnique({ where: { id: req.userId } });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        const { password: _p, ...safeUser } = user;
        res.json({ user: safeUser });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.default = router;
