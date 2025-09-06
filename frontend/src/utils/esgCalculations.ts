// src/utils/esgCalculations.ts
import { ESGMetrics, CalculatedMetrics } from '@/types/esg';

export const calculateESGMetrics = (data: ESGMetrics): CalculatedMetrics => {
  const { environmental, social, governance } = data;
  
  // Carbon Intensity = (Carbon emissions / Total revenue) T CO2e / INR
  const carbonIntensity = governance.totalRevenue > 0 
    ? environmental.carbonEmissions / governance.totalRevenue 
    : 0;
  
  // Renewable Electricity Ratio = 100 * (Renewable electricity consumption / Total electricity consumption) %
  const renewableElectricityRatio = environmental.totalElectricityConsumption > 0 
    ? (environmental.renewableElectricityConsumption / environmental.totalElectricityConsumption) * 100 
    : 0;
  
  // Diversity Ratio = 100 * (Female Employees / Total Employees) %
  const diversityRatio = social.totalEmployees > 0 
    ? (social.femaleEmployees / social.totalEmployees) * 100 
    : 0;
  
  // Community Spend Ratio = 100 * (Community investment spend / Total Revenue) %
  const communitySpendRatio = governance.totalRevenue > 0 
    ? (social.communityInvestmentSpend / governance.totalRevenue) * 100 
    : 0;

  return {
    carbonIntensity,
    renewableElectricityRatio,
    diversityRatio,
    communitySpendRatio,
  };
};

export const validateESGData = (data: ESGMetrics): string[] => {
  const errors: string[] = [];
  
  // Environmental validations
  if (data.environmental.renewableElectricityConsumption > data.environmental.totalElectricityConsumption) {
    errors.push('Renewable electricity consumption cannot exceed total electricity consumption');
  }
  
  // Social validations
  if (data.social.femaleEmployees > data.social.totalEmployees) {
    errors.push('Female employees cannot exceed total employees');
  }
  
  // Governance validations
  if (data.governance.independentBoardMembers > 100) {
    errors.push('Independent board members percentage cannot exceed 100%');
  }
  
  return errors;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num: number, decimals: number = 2): string => {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const getESGCompletionPercentage = (data: ESGMetrics): number => {
  const totalFields = 11; // Total number of input fields
  let filledFields = 0;
  
  // Environmental fields (4)
  if (data.environmental.totalElectricityConsumption > 0) filledFields++;
  if (data.environmental.renewableElectricityConsumption > 0) filledFields++;
  if (data.environmental.totalFuelConsumption > 0) filledFields++;
  if (data.environmental.carbonEmissions > 0) filledFields++;
  
  // Social fields (4)
  if (data.social.totalEmployees > 0) filledFields++;
  if (data.social.femaleEmployees > 0) filledFields++;
  if (data.social.averageTrainingHours > 0) filledFields++;
  if (data.social.communityInvestmentSpend > 0) filledFields++;
  
  // Governance fields (3)
  if (data.governance.independentBoardMembers > 0) filledFields++;
  if (data.governance.hasDataPrivacyPolicy !== undefined) filledFields++; // Boolean field
  if (data.governance.totalRevenue > 0) filledFields++;
  
  return Math.round((filledFields / totalFields) * 100);
};

export const getESGScoreRating = (percentage: number): {
  rating: string;
  color: string;
  description: string;
} => {
  if (percentage >= 90) {
    return {
      rating: 'Excellent',
      color: 'text-green-600',
      description: 'Outstanding ESG performance with comprehensive data coverage'
    };
  } else if (percentage >= 70) {
    return {
      rating: 'Good',
      color: 'text-blue-600',
      description: 'Strong ESG performance with good data coverage'
    };
  } else if (percentage >= 50) {
    return {
      rating: 'Fair',
      color: 'text-yellow-600',
      description: 'Moderate ESG performance, room for improvement'
    };
  } else {
    return {
      rating: 'Needs Improvement',
      color: 'text-red-600',
      description: 'Limited ESG data, significant improvement needed'
    };
  }
};