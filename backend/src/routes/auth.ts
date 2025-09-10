import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma";
import { signToken } from "../utils/jwt";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { User } from "@prisma/client";

const router = Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

// signup
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body as {
      firstName?: string;
      lastName?: string;
      email: string;
      password: string;
    };

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { firstName, lastName, email, password: hashedPassword },
    });

    const token = signToken({ userId: user.id });

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body as { email: string; password: string };

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = signToken({ userId: user.id });
    res.cookie("token", token, cookieOptions);

    return res.json({ message: "Login successful", token });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

// logout
router.post("/logout", (_req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ ok: true });
});

// me
router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const { password, ...safeUser } = user as User & { password: string };
    res.json({ user: safeUser });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
