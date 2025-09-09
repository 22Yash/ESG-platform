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
