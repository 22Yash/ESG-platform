export interface ESGResponse {
  id: string;
  userId: string;
  year: number;  // ✅ fixed: now number

  // Environmental
  totalElectricityConsumption?: number;      // kWh
  renewableElectricityConsumption?: number;  // kWh
  totalFuelConsumption?: number;             // liters
  carbonEmissions?: number;                  // T CO2e

  // Social
  totalEmployees?: number;
  femaleEmployees?: number;
  averageTrainingHours?: number;
  communityInvestment?: number;              // INR

  // Governance
  independentBoardMembers?: number;          // percentage
  hasDataPrivacyPolicy?: boolean;
  totalRevenue?: number;                     // INR

  // Calculated metrics
  carbonIntensity?: number;           // T CO2e / M INR
  renewableElectricityRatio?: number; // %
  diversityRatio?: number;            // %
  communitySpendRatio?: number;       // %

  createdAt?: Date;
  updatedAt?: Date;
}
