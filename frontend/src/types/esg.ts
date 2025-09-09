export interface ESGResponse {
  id: string;
  userId: string;
  year: number;

  // Environmental
  totalElectricityConsumption?: number;
  renewableElectricityConsumption?: number;
  totalFuelConsumption?: number;
  carbonEmissions?: number;

  // Social
  totalEmployees?: number;
  femaleEmployees?: number;
  averageTrainingHours?: number;
  communityInvestment?: number;

  // Governance
  independentBoardMembers?: number;
  hasDataPrivacyPolicy?: boolean;
  totalRevenue?: number;

  // Calculated metrics
  carbonIntensity?: number;
  renewableElectricityRatio?: number;
  diversityRatio?: number;
  communitySpendRatio?: number;

  createdAt?: Date;
  updatedAt?: Date;

  calculatedMetrics?: {
    carbonIntensity: number;
    renewableElectricityRatio: number;
    diversityRatio: number;
    communitySpendRatio: number;
  };
}

export interface ESGMetrics {
  environmental: {
    totalElectricityConsumption: number;
    renewableElectricityConsumption: number;
    totalFuelConsumption: number;
    carbonEmissions: number;
  };
  social: {
    totalEmployees: number;
    femaleEmployees: number;
    averageTrainingHours: number;
    communityInvestmentSpend: number;
  };
  governance: {
    independentBoardMembers: number;
    hasDataPrivacyPolicy: boolean;
    totalRevenue: number;
  };
}

export interface CalculatedMetrics {
  carbonIntensity: number;
  renewableElectricityRatio: number;
  diversityRatio: number;
  communitySpendRatio: number;
}
