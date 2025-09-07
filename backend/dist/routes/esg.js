"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/esg.ts
const express_1 = require("express");
const prisma_1 = require("../prisma");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Create ESG response
router.post("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const { year, totalElectricityConsumption, renewableElectricityConsumption, totalFuelConsumption, carbonEmissions, totalEmployees, femaleEmployees, averageTrainingHours, communityInvestment, independentBoardMembers, hasDataPrivacyPolicy, totalRevenue, } = req.body;
        // Validate required fields
        if (!year) {
            return res.status(400).json({ error: "Year is required" });
        }
        // Check if response already exists for this user and year
        const existingResponse = await prisma_1.prisma.eSGResponse.findUnique({
            where: {
                userId_year: {
                    userId,
                    year,
                },
            },
        });
        if (existingResponse) {
            return res.status(400).json({
                error: "ESG response already exists for this year. Use PUT to update."
            });
        }
        // Calculate derived fields
        const carbonIntensity = totalRevenue && carbonEmissions
            ? carbonEmissions / totalRevenue
            : null;
        const renewableElectricityRatio = totalElectricityConsumption && renewableElectricityConsumption
            ? renewableElectricityConsumption / totalElectricityConsumption
            : null;
        const diversityRatio = totalEmployees && femaleEmployees
            ? femaleEmployees / totalEmployees
            : null;
        const communitySpendRatio = totalRevenue && communityInvestment
            ? communityInvestment / totalRevenue
            : null;
        // Fixed: Use correct model name (ESGResponse, not eSGResponse)
        const response = await prisma_1.prisma.eSGResponse.create({
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
    }
    catch (error) {
        console.error("Error creating ESG response:", error);
        if (error.code === 'P2002') {
            res.status(400).json({ error: "ESG response already exists for this year" });
        }
        else {
            res.status(500).json({ error: "Failed to create ESG response" });
        }
    }
});
// Update ESG response
router.put("/:year", auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const year = parseInt(req.params.year);
        const updateData = req.body;
        // Calculate derived fields if base data is provided
        if (updateData.totalRevenue && updateData.carbonEmissions) {
            updateData.carbonIntensity = updateData.carbonEmissions / updateData.totalRevenue;
        }
        if (updateData.totalElectricityConsumption && updateData.renewableElectricityConsumption) {
            updateData.renewableElectricityRatio = updateData.renewableElectricityConsumption / updateData.totalElectricityConsumption;
        }
        if (updateData.totalEmployees && updateData.femaleEmployees) {
            updateData.diversityRatio = updateData.femaleEmployees / updateData.totalEmployees;
        }
        if (updateData.totalRevenue && updateData.communityInvestment) {
            updateData.communitySpendRatio = updateData.communityInvestment / updateData.totalRevenue;
        }
        const response = await prisma_1.prisma.eSGResponse.update({
            where: {
                userId_year: {
                    userId,
                    year,
                },
            },
            data: updateData,
        });
        res.json(response);
    }
    catch (error) {
        console.error("Error updating ESG response:", error);
        if (error.code === 'P2025') {
            res.status(404).json({ error: "No ESG response found for this year" });
        }
        else {
            res.status(500).json({ error: "Failed to update ESG response" });
        }
    }
});
// Get all ESG responses for logged in user
router.get("/", auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const responses = await prisma_1.prisma.eSGResponse.findMany({
            where: { userId: req.userId },
            orderBy: { year: "desc" },
        });
        res.json(responses);
    }
    catch (error) {
        console.error("Error fetching ESG responses:", error);
        res.status(500).json({ error: "Failed to fetch ESG responses" });
    }
});
// Get ESG response by year
router.get("/:year", auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const year = parseInt(req.params.year);
        if (isNaN(year)) {
            return res.status(400).json({ error: "Invalid year parameter" });
        }
        const response = await prisma_1.prisma.eSGResponse.findUnique({
            where: {
                userId_year: {
                    userId,
                    year,
                },
            },
        });
        if (!response) {
            return res.status(404).json({ error: "No ESG response found for this year" });
        }
        res.json(response);
    }
    catch (error) {
        console.error("Error fetching ESG response:", error);
        res.status(500).json({ error: "Failed to fetch ESG response" });
    }
});
// Delete ESG response
// router.delete("/:year", authMiddleware, async (req: AuthRequest, res) => {
//   try {
//     const userId = req.userId!;
//     const year = parseInt(req.params.year);
//     const response = await prisma.eSGResponse.delete({
//       where: {
//         userId_year: {
//           userId,
//           year,
//         },
//       },
//     });
//     res.json({ message: "ESG response deleted successfully", response });
//   } catch (error: any) {
//     console.error("Error deleting ESG response:", error);
//     if (error.code === 'P2025') {
//       res.status(404).json({ error: "No ESG response found for this year" });
//     } else {
//       res.status(500).json({ error: "Failed to delete ESG response" });
//     }
//   }
// });
exports.default = router;
