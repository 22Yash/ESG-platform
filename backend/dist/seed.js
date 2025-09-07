"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("./prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function main() {
    try {
        // Hash the password
        const hashedPassword = await bcryptjs_1.default.hash("test123", 10);
        // Create a test user
        const user = await prisma_1.prisma.user.create({
            data: {
                firstName: "Yash",
                lastName: "Doke",
                email: "yash@example.com",
                password: hashedPassword,
            },
        });
        console.log("User created:", user);
        // Create a sample ESG response
        const esgResponse = await prisma_1.prisma.eSGResponse.create({
            data: {
                userId: user.id,
                year: 2025,
                totalElectricityConsumption: 10000,
                renewableElectricityConsumption: 4000,
                totalFuelConsumption: 2000,
                carbonEmissions: 1500,
                totalEmployees: 100,
                femaleEmployees: 40,
                averageTrainingHours: 25,
                communityInvestment: 50000,
                independentBoardMembers: 3,
                hasDataPrivacyPolicy: true,
                totalRevenue: 1000000,
                // Derived fields (calculated manually for seeding)
                carbonIntensity: 1500 / 1000000, // 0.0015
                renewableElectricityRatio: 4000 / 10000, // 0.4
                diversityRatio: 40 / 100, // 0.4
                communitySpendRatio: 50000 / 1000000, // 0.05
            },
        });
        console.log("ESG response created:", esgResponse);
        // Optional: Create additional sample data
        const esgResponse2024 = await prisma_1.prisma.eSGResponse.create({
            data: {
                userId: user.id,
                year: 2024,
                totalElectricityConsumption: 9500,
                renewableElectricityConsumption: 3500,
                carbonEmissions: 1600,
                totalEmployees: 95,
                femaleEmployees: 35,
                totalRevenue: 950000,
                carbonIntensity: 1600 / 950000,
                renewableElectricityRatio: 3500 / 9500,
                diversityRatio: 35 / 95,
            },
        });
        console.log("ESG response 2024 created:", esgResponse2024);
    }
    catch (error) {
        console.error("Error in seeding:", error);
        throw error;
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.prisma.$disconnect();
});
