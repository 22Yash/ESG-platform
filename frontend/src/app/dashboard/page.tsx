'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Factory, Zap, Users, DollarSign, CheckCircle, AlertCircle, FileText, Calendar } from 'lucide-react';

interface ESGData {
  id: string;
  userId: string;
  year: number;
  totalEmployees: number;
  femaleEmployees: number;
  averageTrainingHours: number;
  communityInvestment: number;
  independentBoardMembers: number;
  hasDataPrivacyPolicy: boolean;
  totalRevenue: number;
  carbonIntensity: number;
  renewableElectricityRatio: number;
  diversityRatio: number;
  communitySpendRatio: number;
}

const ESGDashboard = () => {
  const [esgData, setEsgData] = useState<ESGData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/esg', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch data');
        return res.json();
      })
      .then((data: ESGData[]) => {
        const sortedData = data.sort((a, b) => b.year - a.year);
        setEsgData(sortedData);
        setSelectedYear(sortedData[0]?.year || null);
      })
      .catch(err => {
        console.error(err);
        setError('Failed to load ESG data');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-12 w-12 border-b-2 border-emerald-600 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading ESG data...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );

  if (!esgData.length) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">No ESG data found.</p>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
          Add ESG Data
        </button>
      </div>
    </div>
  );

  const years = Array.from(new Set(esgData.map(d => d.year))).sort((a, b) => b - a);
  const currentData = esgData.find(d => d.year === selectedYear) || esgData[0];

  const calculatedMetrics = {
    carbonIntensity: (currentData.carbonIntensity * 1000000).toFixed(2),
    renewableRatio: (currentData.renewableElectricityRatio * 100).toFixed(1),
    diversityRatio: (currentData.diversityRatio * 100).toFixed(1),
    communitySpendRatio: (currentData.communitySpendRatio * 100).toFixed(2)
  };

  const StatCard = ({ icon, title, value, unit, color = 'emerald' }: any) => {
    const colorClasses: Record<string, string> = {
      emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      red: 'bg-red-50 text-red-600 border-red-200'
    };
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className={`p-3 rounded-xl ${colorClasses[color]} border mb-4`}>{icon}</div>
        <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{value}</span>
          <span className="text-gray-500 text-sm font-medium">{unit}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10 mt-[100px]" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to ESG Dashboard</h1>
              <p className="text-gray-600">Quick snapshot of your ESG performance</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-gray-500" />
              <select
                value={selectedYear || ''}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Factory size={20} />} title="Carbon Intensity" value={calculatedMetrics.carbonIntensity} unit="T CO₂e/M INR" color="red" />
          <StatCard icon={<Zap size={20} />} title="Renewable Energy" value={calculatedMetrics.renewableRatio} unit="%" color="emerald" />
          <StatCard icon={<Users size={20} />} title="Gender Diversity" value={calculatedMetrics.diversityRatio} unit="%" color="purple" />
          <StatCard icon={<DollarSign size={20} />} title="Community Investment" value={calculatedMetrics.communitySpendRatio} unit="% of Revenue" color="orange" />
        </div>

        {/* Alerts */}
        <div className="space-y-4 mb-8">
          {!currentData.hasDataPrivacyPolicy && (
            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
              <AlertCircle size={20} /> Data Privacy Policy is missing!
            </div>
          )}
          {currentData.totalEmployees === 0 && (
            <div className="flex items-center gap-2 p-4 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200">
              <AlertCircle size={20} /> No employee data available for this year.
            </div>
          )}
        </div>

        {/* Actionable Shortcuts */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <Link href="/questionnaire">Add ESG Data</Link>
            
            </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Link href="/summary"> View Summary </Link></button>
          <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          <Link href=""> Export Report
            </Link></button>
        </div>
      </div>
    </div>
  );
};

export default ESGDashboard;
