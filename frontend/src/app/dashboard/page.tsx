import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Download, 
  Plus, 
  Edit3, 
  TrendingUp, 
  Users, 
  Zap, 
  Leaf, 
  FileText,
  Calendar,
  DollarSign,
  Target,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Sample data - in real app this would come from your API
const sampleData = {
  "2023": {
    totalElectricity: 50000,
    renewableElectricity: 15000,
    totalFuel: 8000,
    carbonEmissions: 120,
    totalEmployees: 250,
    femaleEmployees: 95,
    trainingHours: 40,
    communityInvestment: 500000,
    independentBoardMembers: 60,
    hasDataPrivacyPolicy: "Yes",
    totalRevenue: 10000000
  },
  "2022": {
    totalElectricity: 48000,
    renewableElectricity: 12000,
    totalFuel: 9000,
    carbonEmissions: 135,
    totalEmployees: 230,
    femaleEmployees: 82,
    trainingHours: 35,
    communityInvestment: 450000,
    independentBoardMembers: 55,
    hasDataPrivacyPolicy: "Yes",
    totalRevenue: 9200000
  },
  "2021": {
    totalElectricity: 45000,
    renewableElectricity: 9000,
    totalFuel: 10000,
    carbonEmissions: 150,
    totalEmployees: 200,
    femaleEmployees: 70,
    trainingHours: 30,
    communityInvestment: 400000,
    independentBoardMembers: 50,
    hasDataPrivacyPolicy: "No",
    totalRevenue: 8500000
  }
};

// Calculate auto-calculated metrics
const calculateMetrics = (data) => {
  const result = {};
  Object.keys(data).forEach(year => {
    const yearData = data[year];
    result[year] = {
      ...yearData,
      carbonIntensity: (yearData.carbonEmissions / yearData.totalRevenue * 1000000).toFixed(4),
      renewableRatio: ((yearData.renewableElectricity / yearData.totalElectricity) * 100).toFixed(1),
      diversityRatio: ((yearData.femaleEmployees / yearData.totalEmployees) * 100).toFixed(1),
      communitySpendRatio: ((yearData.communityInvestment / yearData.totalRevenue) * 100).toFixed(2)
    };
  });
  return result;
};

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2023");
  const calculatedData = calculateMetrics(sampleData);
  const years = Object.keys(calculatedData).sort().reverse();
  
  // Prepare chart data


 

  const currentData = calculatedData[selectedYear];
  const StatCard = () => {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-${color}-100 rounded-lg`}>
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              <TrendingUp size={14} className={trend < 0 ? 'rotate-180' : ''} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          <span className="text-gray-500 text-sm">{unit}</span>
        </div>
      </div>
    );
  };

  const handleExport = (format) => {
    alert(`Exporting as ${format}... (This would trigger actual export in real app)`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ESG Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your sustainability metrics and performance</p>
            </div>
            <div className="flex items-center gap-4">
              <select 
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <button 
                onClick={() => handleExport('PDF')}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Download size={16} />
                Export PDF
              </button>
              <button 
                onClick={() => handleExport('Excel')}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={16} />
                Export Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
              <Plus size={16} />
              Add New Year Data
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              <Edit3 size={16} />
              Edit {selectedYear} Data
            </button>
          </div>
        </div>

        {/* Auto-Calculated Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Target className="text-emerald-600" size={20} />}
            title="Carbon Intensity"
            value={currentData.carbonIntensity}
            unit="T CO2e/INR"
            color="emerald"
          />
          <StatCard
            icon={<Zap className="text-blue-600" size={20} />}
            title="Renewable Electricity"
            value={currentData.renewableRatio}
            unit="%"
            color="blue"
          />
          <StatCard
            icon={<Users className="text-purple-600" size={20} />}
            title="Diversity Ratio"
            value={currentData.diversityRatio}
            unit="%"
            color="purple"
          />
          <StatCard
            icon={<DollarSign className="text-orange-600" size={20} />}
            title="Community Spend"
            value={currentData.communitySpendRatio}
            unit="%"
            color="orange"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Trends Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">ESG Metrics Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="renewableRatio" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Renewable Electricity (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="diversityRatio" 
                  stroke="#8B5CF6" 
                  strokeWidth={2}
                  name="Diversity Ratio (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="communitySpendRatio" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  name="Community Spend (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Electricity Mix Pie Chart */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Electricity Mix ({selectedYear})</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Environmental Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Leaf className="text-emerald-600" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Environmental</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Electricity</span>
                <span className="font-medium">{currentData.totalElectricity.toLocaleString()} kWh</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Renewable Electricity</span>
                <span className="font-medium">{currentData.renewableElectricity.toLocaleString()} kWh</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Fuel</span>
                <span className="font-medium">{currentData.totalFuel.toLocaleString()} liters</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Carbon Emissions</span>
                <span className="font-medium">{currentData.carbonEmissions} T CO2e</span>
              </div>
            </div>
          </div>

          {/* Social Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Social</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Employees</span>
                <span className="font-medium">{currentData.totalEmployees}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Female Employees</span>
                <span className="font-medium">{currentData.femaleEmployees}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Avg Training Hours</span>
                <span className="font-medium">{currentData.trainingHours} hrs/year</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Community Investment</span>
                <span className="font-medium">₹{currentData.communityInvestment.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Governance Metrics */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <FileText className="text-indigo-600" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Governance</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Independent Board Members</span>
                <span className="font-medium">{currentData.independentBoardMembers}%</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Data Privacy Policy</span>
                <div className="flex items-center gap-2">
                  {currentData.hasDataPrivacyPolicy === 'Yes' ? (
                    <CheckCircle className="text-green-500" size={16} />
                  ) : (
                    <AlertCircle className="text-red-500" size={16} />
                  )}
                  <span className="font-medium">{currentData.hasDataPrivacyPolicy}</span>
                </div>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-medium">₹{currentData.totalRevenue.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Completeness */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Data Completeness</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {years.map(year => (
              <div key={year} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600 mb-2">{year}</div>
                <div className="text-sm text-gray-600">Complete</div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;