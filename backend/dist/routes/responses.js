"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/responses.ts
const express_1 = require("express");
const prisma_1 = require("../prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// GET all responses for logged-in user
router.get("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const responses = await prisma_1.prisma.eSGResponse.findMany({
            where: { userId },
            orderBy: { year: "desc" },
        });
        // Optional: map the data to a unified format if needed
        const formattedResponses = responses.map((r) => ({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch responses" });
    }
});
exports.default = router;
