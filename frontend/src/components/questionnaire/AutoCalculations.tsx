// src/components/questionnaire/AutoCalculations.tsx
'use client';

import React from 'react';
import { TrendingUp, Zap, Users2, Heart, Calculator } from 'lucide-react';
import { ESGMetrics } from '@/types/esg';

interface AutoCalculationsProps {
  data?: ESGMetrics;
  year: string;
}

interface CalculatedMetric {
  label: string;
  value: number;
  unit: string;
  formula: string;
  icon: React.ReactNode;
  color: string;
  isValid: boolean;
}

const AutoCalculations: React.FC<AutoCalculationsProps> = ({ data, year }) => {
  if (!data) return null;

  const calculateMetrics = (): CalculatedMetric[] => {
    const { environmental, social, governance } = data;
    
    // Carbon Intensity = (Carbon emissions / Total revenue) T CO2e / INR
    const carbonIntensity = governance.totalRevenue > 0 
      ? environmental.carbonEmissions / governance.totalRevenue 
      : 0;
    
    // Renewable Electricity Ratio = 100 * (Renewable electricity consumption / Total electricity consumption) %
    const renewableRatio = environmental.totalElectricityConsumption > 0 
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

    return [
      {
        label: 'Carbon Intensity',
        value: carbonIntensity,
        unit: 'T CO2e / INR',
        formula: 'Carbon Emissions ÷ Total Revenue',
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'from-red-500 to-orange-500',
        isValid: governance.totalRevenue > 0 && environmental.carbonEmissions > 0,
      },
      {
        label: 'Renewable Electricity Ratio',
        value: renewableRatio,
        unit: '%',
        formula: '(Renewable ÷ Total Electricity) × 100',
        icon: <Zap className="w-5 h-5" />,
        color: 'from-green-500 to-emerald-500',
        isValid: environmental.totalElectricityConsumption > 0,
      },
      {
        label: 'Diversity Ratio',
        value: diversityRatio,
        unit: '%',
        formula: '(Female ÷ Total Employees) × 100',
        icon: <Users2 className="w-5 h-5" />,
        color: 'from-blue-500 to-indigo-500',
        isValid: social.totalEmployees > 0,
      },
      {
        label: 'Community Spend Ratio',
        value: communitySpendRatio,
        unit: '%',
        formula: '(Community Spend ÷ Total Revenue) × 100',
        icon: <Heart className="w-5 h-5" />,
        color: 'from-purple-500 to-violet-500',
        isValid: governance.totalRevenue > 0 && social.communityInvestmentSpend > 0,
      },
    ];
  };

  const metrics = calculateMetrics();

  const formatValue = (value: number, unit: string): string => {
    if (value === 0) return '0';
    
    if (unit === 'T CO2e / INR') {
      return value.toExponential(2);
    }
    
    if (unit === '%') {
      return value.toFixed(1);
    }
    
    return value.toFixed(2);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
        <div className="flex items-center">
          <Calculator className="w-6 h-6 text-white mr-3" />
          <h3 className="text-lg font-semibold text-white">Auto-Calculated Metrics</h3>
        </div>
        <p className="text-gray-300 text-sm mt-1">FY {year}</p>
      </div>
      
      <div className="p-6 space-y-6">
        {metrics.map((metric, index) => (
          <div key={index} className="relative">
            <div className={`
              p-4 rounded-lg bg-gradient-to-r ${metric.color} 
              ${metric.isValid ? 'opacity-100' : 'opacity-50'}
            `}>
              <div className="flex items-start justify-between text-white">
                <div className="flex items-center">
                  {metric.icon}
                  <span className="ml-2 font-medium text-sm">{metric.label}</span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {metric.isValid ? formatValue(metric.value, metric.unit) : '—'}
                  </div>
                  <div className="text-xs opacity-80">{metric.unit}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-2 px-2">
              <div className="text-xs text-gray-500">{metric.formula}</div>
              {!metric.isValid && (
                <div className="text-xs text-amber-600 mt-1">
                  ⚠️ Missing required data for calculation
                </div>
              )}
            </div>
          </div>
        ))}
        
        <div className="pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Calculations update in real-time as you enter data</p>
            <p>• All ratios are calculated based on your inputs</p>
            <p>• Carbon intensity shows emissions per revenue unit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoCalculations;