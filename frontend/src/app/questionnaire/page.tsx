// src/app/questionnaire/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Save, Download, Calendar, TrendingUp } from 'lucide-react';
import ESGForm from '@/components/questionnaire/ESGForm';
import AutoCalculations from '@/components/questionnaire/AutoCalculations';
import YearSelector from '@/components/questionnaire/YearSelector';
import { ESGData, ESGMetrics } from '@/types/esg';

const QuestionnairePage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [esgData, setEsgData] = useState<ESGData>({});
  const [isLoading, setSavedLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize empty data structure for current year if it doesn't exist
  useEffect(() => {
    if (!esgData[selectedYear]) {
      setEsgData(prev => ({
        ...prev,
        [selectedYear]: {
          environmental: {
            totalElectricityConsumption: 0,
            renewableElectricityConsumption: 0,
            totalFuelConsumption: 0,
            carbonEmissions: 0,
          },
          social: {
            totalEmployees: 0,
            femaleEmployees: 0,
            averageTrainingHours: 0,
            communityInvestmentSpend: 0,
          },
          governance: {
            independentBoardMembers: 0,
            hasDataPrivacyPolicy: false,
            totalRevenue: 0,
          },
        },
      }));
    }
  }, [selectedYear, esgData]);

  const handleDataChange = (category: keyof ESGMetrics, field: string, value: number | boolean) => {
    setEsgData(prev => ({
      ...prev,
      [selectedYear]: {
        ...prev[selectedYear],
        [category]: {
          ...prev[selectedYear]?.[category],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setSavedLoading(true);
    try {
      // API call to save data
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          year: selectedYear,
          data: esgData[selectedYear],
        }),
      });

      if (response.ok) {
        setLastSaved(new Date());
        // Show success notification
      }
    } catch (error) {
      console.error('Failed to save:', error);
      // Show error notification
    } finally {
      setSavedLoading(false);
    }
  };

  const currentYearData = esgData[selectedYear];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ESG Questionnaire</h1>
              <p className="text-gray-600 mt-1">
                Enter your Environmental, Social, and Governance metrics
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <YearSelector 
                selectedYear={selectedYear} 
                onYearChange={setSelectedYear}
              />
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
          
          {lastSaved && (
            <div className="mt-3 text-sm text-green-600">
              Last saved: {lastSaved.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="xl:col-span-2">
            {/* <ESGForm 
              data={currentYearData}
              onDataChange={handleDataChange}
            /> */}
          </div>

          {/* Sidebar with Progress and Calculations */}
          <div className="xl:col-span-2 space-y-6">
            <div className="sticky top-8 space-y-6">
              {/* <ProgressIndicator 
                data={currentYearData}
                year={selectedYear}
              /> */}
              <AutoCalculations 
                data={currentYearData}
                year={selectedYear}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnairePage;