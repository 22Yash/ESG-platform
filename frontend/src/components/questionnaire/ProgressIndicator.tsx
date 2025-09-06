// src/components/questionnaire/ProgressIndicator.tsx
'use client';

import React from 'react';
import { CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { ESGMetrics } from '@/types/esg';
import { getESGCompletionPercentage, getESGScoreRating } from '@/utils/esgCalculations';

interface ProgressIndicatorProps {
  data?: ESGMetrics;
  year: string;
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ data, year }) => {
  if (!data) return null;

  const completionPercentage = getESGCompletionPercentage(data);
  const rating = getESGScoreRating(completionPercentage);

  const categories = [
    {
      name: 'Environmental',
      fields: [
        { label: 'Total Electricity', completed: data.environmental.totalElectricityConsumption > 0 },
        { label: 'Renewable Electricity', completed: data.environmental.renewableElectricityConsumption > 0 },
        { label: 'Fuel Consumption', completed: data.environmental.totalFuelConsumption > 0 },
        { label: 'Carbon Emissions', completed: data.environmental.carbonEmissions > 0 },
      ],
      color: 'green',
    },
    {
      name: 'Social',
      fields: [
        { label: 'Total Employees', completed: data.social.totalEmployees > 0 },
        { label: 'Female Employees', completed: data.social.femaleEmployees > 0 },
        { label: 'Training Hours', completed: data.social.averageTrainingHours > 0 },
        { label: 'Community Investment', completed: data.social.communityInvestmentSpend > 0 },
      ],
      color: 'blue',
    },
    {
      name: 'Governance',
      fields: [
        { label: 'Board Independence', completed: data.governance.independentBoardMembers > 0 },
        { label: 'Privacy Policy', completed: data.governance.hasDataPrivacyPolicy !== undefined },
        { label: 'Total Revenue', completed: data.governance.totalRevenue > 0 },
      ],
      color: 'purple',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900">Progress Overview</h3>
        <p className="text-sm text-gray-600">FY {year} Data Completion</p>
      </div>
      
      <div className="p-6">
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
            <span className="text-sm font-semibold text-gray-900">{completionPercentage}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              completionPercentage >= 70 ? 'bg-green-500' : 
              completionPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            }`} />
            <span className={`text-sm font-medium ${rating.color}`}>
              {rating.rating}
            </span>
            <span className="text-xs text-gray-500">• {rating.description}</span>
          </div>
        </div>

        {/* Category Progress */}
        <div className="space-y-4">
          {categories.map((category) => {
            const completedFields = category.fields.filter(field => field.completed).length;
            const totalFields = category.fields.length;
            const categoryProgress = Math.round((completedFields / totalFields) * 100);
            
            return (
              <div key={category.name} className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  <span className="text-xs text-gray-500">
                    {completedFields}/{totalFields} completed
                  </span>
                </div>
                
                <div className="space-y-2">
                  {category.fields.map((field) => (
                    <div key={field.label} className="flex items-center space-x-2">
                      {field.completed ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-300" />
                      )}
                      <span className={`text-sm ${
                        field.completed ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {field.label}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        category.color === 'green' ? 'bg-green-500' :
                        category.color === 'blue' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${categoryProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Tips */}
        {completionPercentage < 100 && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium mb-1">Complete your ESG assessment</p>
                <p>Fill in all metrics to get comprehensive auto-calculated insights and generate meaningful reports.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;