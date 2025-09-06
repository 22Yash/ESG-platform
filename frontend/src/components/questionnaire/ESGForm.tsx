// src/components/questionnaire/ESGForm.tsx
'use client';

import React from 'react';
import { Leaf, Users, Shield } from 'lucide-react';
import MetricInput from './MetricInput';
import { ESGMetrics } from '@/types/esg';

interface ESGFormProps {
  data?: ESGMetrics;
  onDataChange: (category: keyof ESGMetrics, field: string, value: number | boolean) => void;
}

const ESGForm: React.FC<ESGFormProps> = ({ data, onDataChange }) => {
  if (!data) return <div>Loading...</div>;

  const handleInputChange = (category: keyof ESGMetrics, field: string) => 
    (value: number | boolean) => {
      onDataChange(category, field, value);
    };

  return (
    <div className="space-y-8">
      {/* Environmental Section */}
      <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4">
          <div className="flex items-center">
            <Leaf className="w-6 h-6 text-white mr-3" />
            <h2 className="text-xl font-semibold text-white">Environmental</h2>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricInput
            label="Total Electricity Consumption"
            unit="kWh"
            value={data.environmental.totalElectricityConsumption}
            onChange={handleInputChange('environmental', 'totalElectricityConsumption')}
            placeholder="Enter total electricity consumption"
            required
          />
          
          <MetricInput
            label="Renewable Electricity Consumption"
            unit="kWh"
            value={data.environmental.renewableElectricityConsumption}
            onChange={handleInputChange('environmental', 'renewableElectricityConsumption')}
            placeholder="Enter renewable electricity consumption"
            max={data.environmental.totalElectricityConsumption}
          />
          
          <MetricInput
            label="Total Fuel Consumption"
            unit="liters"
            value={data.environmental.totalFuelConsumption}
            onChange={handleInputChange('environmental', 'totalFuelConsumption')}
            placeholder="Enter total fuel consumption"
          />
          
          <MetricInput
            label="Carbon Emissions"
            unit="T CO2e"
            value={data.environmental.carbonEmissions}
            onChange={handleInputChange('environmental', 'carbonEmissions')}
            placeholder="Enter carbon emissions"
          />
        </div>
      </div>

      {/* Social Section */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-4">
          <div className="flex items-center">
            <Users className="w-6 h-6 text-white mr-3" />
            <h2 className="text-xl font-semibold text-white">Social</h2>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricInput
            label="Total Number of Employees"
            unit=""
            value={data.social.totalEmployees}
            onChange={handleInputChange('social', 'totalEmployees')}
            placeholder="Enter total employees"
            integer
            required
          />
          
          <MetricInput
            label="Number of Female Employees"
            unit=""
            value={data.social.femaleEmployees}
            onChange={handleInputChange('social', 'femaleEmployees')}
            placeholder="Enter female employees"
            integer
            max={data.social.totalEmployees}
          />
          
          <MetricInput
            label="Average Training Hours per Employee"
            unit="hours/year"
            value={data.social.averageTrainingHours}
            onChange={handleInputChange('social', 'averageTrainingHours')}
            placeholder="Enter average training hours"
          />
          
          <MetricInput
            label="Community Investment Spend"
            unit="INR"
            value={data.social.communityInvestmentSpend}
            onChange={handleInputChange('social', 'communityInvestmentSpend')}
            placeholder="Enter community investment"
            currency
          />
        </div>
      </div>

      {/* Governance Section */}
      <div className="bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-violet-500 px-6 py-4">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-white mr-3" />
            <h2 className="text-xl font-semibold text-white">Governance</h2>
          </div>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricInput
            label="% of Independent Board Members"
            unit="%"
            value={data.governance.independentBoardMembers}
            onChange={handleInputChange('governance', 'independentBoardMembers')}
            placeholder="Enter percentage"
            max={100}
          />
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Data Privacy Policy
            </label>
            <select
              value={data.governance.hasDataPrivacyPolicy ? 'yes' : 'no'}
              onChange={(e) => handleInputChange('governance', 'hasDataPrivacyPolicy')(e.target.value === 'yes')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          
          <MetricInput
            label="Total Revenue"
            unit="INR"
            value={data.governance.totalRevenue}
            onChange={handleInputChange('governance', 'totalRevenue')}
            placeholder="Enter total revenue"
            currency
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ESGForm;