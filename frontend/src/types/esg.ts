// src/types/esg.ts

export interface EnvironmentalMetrics {
    totalElectricityConsumption: number;      // kWh
    renewableElectricityConsumption: number;  // kWh
    totalFuelConsumption: number;             // liters
    carbonEmissions: number;                  // T CO2e
  }
  
  export interface SocialMetrics {
    totalEmployees: number;                   // count
    femaleEmployees: number;                  // count
    averageTrainingHours: number;             // hours per employee per year
    communityInvestmentSpend: number;         // INR
  }
  
  export interface GovernanceMetrics {
    independentBoardMembers: number;          // percentage
    hasDataPrivacyPolicy: boolean;            // Yes/No dropdown
    totalRevenue: number;                     // INR
  }
  
  export interface ESGMetrics {
    environmental: EnvironmentalMetrics;
    social: SocialMetrics;
    governance: GovernanceMetrics;
  }
  
  export interface ESGData {
    [year: string]: ESGMetrics;
  }
  
  export interface CalculatedMetrics {
    carbonIntensity: number;           // T CO2e / INR
    renewableElectricityRatio: number; // %
    diversityRatio: number;            // %
    communitySpendRatio: number;       // %
  }
  
  export interface ESGResponse {
    id: string;
    userId: string;
    year: string;
    data: ESGMetrics;
    calculatedMetrics: CalculatedMetrics;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
  }
  
  // Form validation types
  export interface ValidationError {
    field: string;
    message: string;
  }
  
  export interface FormState {
    isLoading: boolean;
    isDirty: boolean;
    errors: ValidationError[];
    lastSaved?: Date;
  }