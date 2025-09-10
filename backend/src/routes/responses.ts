// src/routes/responses.ts
import { Router } from "express";
import {prisma} from "../prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { ESGResponse } from "@prisma/client"; // ✅ Prisma-generated type

const router = Router();

// GET all responses for logged-in user
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const responses = await prisma.eSGResponse.findMany({
      where: { userId },
      orderBy: { year: "desc" },
    });

    // ✅ Explicitly type r as ESGResponse
    const formattedResponses = responses.map((r: ESGResponse) => ({
      id: r.id,
      year: r.year,
      data: {
        totalElectricityConsumption: r.totalElectricityConsumption,
        renewableElectricityConsumption: r.renewableElectricityConsumption,
        totalFuelConsumption: r.totalFuelConsumption,
        carbonEmissions: r.carbonEmissions,
        totalEmployees: r.totalEmployees,
        femaleEmployees: r.femaleEmployees,
        averageTrainingHours: r.averageTrainingHours,
        communityInvestment: r.communityInvestment,
        independentBoardMembers: r.independentBoardMembers,
        hasDataPrivacyPolicy: r.hasDataPrivacyPolicy,
        totalRevenue: r.totalRevenue,
        carbonIntensity: r.carbonIntensity,
        renewableElectricityRatio: r.renewableElectricityRatio,
        diversityRatio: r.diversityRatio,
        communitySpendRatio: r.communitySpendRatio,
      },
      createdAt: r.createdAt,
    }));

    res.json(formattedResponses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
});

export default router;
