import { Router } from "express";
import prisma from "../prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
const ESG = prisma.eSGResponse;

// Create ESG response
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const {
      year,
      totalElectricityConsumption,
      renewableElectricityConsumption,
      totalFuelConsumption,
      carbonEmissions,
      totalEmployees,
      femaleEmployees,
      averageTrainingHours,
      communityInvestment,
      independentBoardMembers,
      hasDataPrivacyPolicy,
      totalRevenue,
    } = req.body as any;

    if (!year) return res.status(400).json({ error: "Year is required" });

    const existingResponse = await ESG.findUnique({
      where: { userId_year: { userId, year } },
    });

    if (existingResponse) {
      return res
        .status(400)
        .json({ error: "ESG response already exists for this year. Use PUT to update." });
    }

    const carbonIntensity =
      totalRevenue && carbonEmissions ? carbonEmissions / totalRevenue : null;

    const renewableElectricityRatio =
      totalElectricityConsumption && renewableElectricityConsumption
        ? renewableElectricityConsumption / totalElectricityConsumption
        : null;

    const diversityRatio =
      totalEmployees && femaleEmployees ? femaleEmployees / totalEmployees : null;

    const communitySpendRatio =
      totalRevenue && communityInvestment ? communityInvestment / totalRevenue : null;

    const response = await ESG.create({
      data: {
        userId,
        year,
        totalElectricityConsumption,
        renewableElectricityConsumption,
        totalFuelConsumption,
        carbonEmissions,
        totalEmployees,
        femaleEmployees,
        averageTrainingHours,
        communityInvestment,
        independentBoardMembers,
        hasDataPrivacyPolicy,
        totalRevenue,
        carbonIntensity,
        renewableElectricityRatio,
        diversityRatio,
        communitySpendRatio,
      },
    });

    res.status(201).json(response);
  } catch (error: any) {
    console.error("Error creating ESG response:", error);
    if (error.code === "P2002") {
      res.status(400).json({ error: "ESG response already exists for this year" });
    } else {
      res.status(500).json({ error: "Failed to create ESG response" });
    }
  }
});

// Update ESG response
router.put("/:year", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const year = parseInt(req.params.year);
    const updateData = { ...req.body };

    if (updateData.totalRevenue && updateData.carbonEmissions) {
      updateData.carbonIntensity = updateData.carbonEmissions / updateData.totalRevenue;
    }
    if (updateData.totalElectricityConsumption && updateData.renewableElectricityConsumption) {
      updateData.renewableElectricityRatio =
        updateData.renewableElectricityConsumption / updateData.totalElectricityConsumption;
    }
    if (updateData.totalEmployees && updateData.femaleEmployees) {
      updateData.diversityRatio = updateData.femaleEmployees / updateData.totalEmployees;
    }
    if (updateData.totalRevenue && updateData.communityInvestment) {
      updateData.communitySpendRatio = updateData.communityInvestment / updateData.totalRevenue;
    }

    const response = await ESG.update({
      where: { userId_year: { userId, year } },
      data: updateData,
    });

    res.json(response);
  } catch (error: any) {
    console.error("Error updating ESG response:", error);
    if (error.code === "P2025") {
      res.status(404).json({ error: "No ESG response found for this year" });
    } else {
      res.status(500).json({ error: "Failed to update ESG response" });
    }
  }
});

// Get all ESG responses
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const responses = await ESG.findMany({
      where: { userId },
      orderBy: { year: "desc" },
    });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ESG responses" });
  }
});

// Get ESG response by year
router.get("/:year", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const year = parseInt(req.params.year);
    if (isNaN(year)) return res.status(400).json({ error: "Invalid year parameter" });

    const response = await ESG.findUnique({
      where: { userId_year: { userId, year } },
    });

    if (!response) {
      return res.status(404).json({ error: "No ESG response found for this year" });
    }

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch ESG response" });
  }
});

export default router;
