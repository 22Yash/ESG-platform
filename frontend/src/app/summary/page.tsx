"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  Download,
  Calendar,
  TrendingUp,
  Users,
  Zap,
  Factory,
  DollarSign,
  AlertCircle,
  CheckCircle,
  FileText,
  Plus,
  Loader,
  ChevronDown,
} from "lucide-react";


import autoTable from "jspdf-autotable";

import html2canvas from "html2canvas";
import domtoimage from "dom-to-image-more";
import {jsPDF} from "jspdf";

interface ESGResponse {
  id: string;
  userId: string;
  year: number;
  totalElectricityConsumption: number;
  renewableElectricityConsumption: number;
  totalFuelConsumption: number;
  carbonEmissions: number;
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
  createdAt: string;
  updatedAt: string;
}

export default function SummaryPage() {
  const [data, setData] = useState<ESGResponse[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dashboardRef = useRef<HTMLDivElement>(null); // Ref for charts container

  useEffect(() => {
    const fetchESGData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/esg", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error(`Error fetching ESG data: ${response.statusText}`);
        }
        const resData: ESGResponse[] = await response.json();
        if (!resData || resData.length === 0) {
          setError("No ESG data found.");
        } else {
          const sortedData = resData.sort((a, b) => b.year - a.year);
          setData(sortedData);
          setSelectedYear(sortedData[0].year);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to fetch ESG data.");
      } finally {
        setLoading(false);
      }
    };

    fetchESGData();
  }, []);

  const currentData = data.find((d) => d.year === selectedYear);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin h-12 w-12 text-emerald-600" />
      </div>
    );
  }

  if (error || !currentData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold">{error || "No data"}</h2>
      </div>
    );
  }

  const years = Array.from(new Set(data.map((d) => d.year))).sort(
    (a, b) => b - a
  );

  const calculatedMetrics = {
    carbonIntensity: currentData.carbonIntensity
      ? (currentData.carbonIntensity * 1000000).toFixed(2)
      : "N/A",
    renewableRatio: currentData.renewableElectricityRatio
      ? (currentData.renewableElectricityRatio * 100).toFixed(1)
      : "N/A",
    diversityRatio: currentData.diversityRatio
      ? (currentData.diversityRatio * 100).toFixed(1)
      : "N/A",
    communitySpendRatio: currentData.communitySpendRatio
      ? (currentData.communitySpendRatio * 100).toFixed(2)
      : "N/A",
  };

  const totalElectricity = currentData.totalElectricityConsumption || 0;
  const renewableElectricity =
    currentData.renewableElectricityConsumption || 0;
  const nonRenewableElectricity = totalElectricity - renewableElectricity;

  const pieData = [
    {
      name: "Renewable",
      value: renewableElectricity,
      fill: "#10B981",
      percentage:
        totalElectricity > 0
          ? ((renewableElectricity / totalElectricity) * 100).toFixed(1)
          : "0",
    },
    {
      name: "Non-Renewable",
      value: nonRenewableElectricity,
      fill: "#EF4444",
      percentage:
        totalElectricity > 0
          ? ((nonRenewableElectricity / totalElectricity) * 100).toFixed(1)
          : "0",
    },
  ];

  const trendData = data
    .map((d) => ({
      year: d.year.toString(),
      "Carbon Intensity": d.carbonIntensity
        ? parseFloat((d.carbonIntensity * 1000000).toFixed(2))
        : 0,
      "Renewable %": d.renewableElectricityRatio
        ? parseFloat((d.renewableElectricityRatio * 100).toFixed(1))
        : 0,
      "Diversity %": d.diversityRatio
        ? parseFloat((d.diversityRatio * 100).toFixed(1))
        : 0,
      "Community Spend %": d.communitySpendRatio
        ? parseFloat((d.communitySpendRatio * 100).toFixed(2))
        : 0,
    }))
    .reverse();

  const StatCard = ({ icon, title, value, unit, color = "emerald" }: any) => {
    const colorClasses = {
      emerald: "bg-emerald-50 text-emerald-600 border-emerald-200",
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      orange: "bg-orange-50 text-orange-600 border-orange-200",
      red: "bg-red-50 text-red-600 border-red-200",
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${colorClasses[color]} border`}>
            {icon}
          </div>
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-gray-900">{value}</span>
          <span className="text-gray-500 text-sm font-medium">{unit}</span>
        </div>
      </div>
    );
  };

  // CSV export
  const exportCSV = () => {
    const csv = Papa.unparse([currentData]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ESG_${selectedYear}.csv`;
    link.click();
  };

  // PDF export with charts
  const exportPDF = async () => {
    if (!dashboardRef.current) return;
  
    try {
      // Convert dashboard div to PNG
      const dataUrl = await domtoimage.toPng(dashboardRef.current, {
        bgcolor: "#ffffff", // force white background
        style: {
          transform: "scale(1)", // keep scaling consistent
        },
        filter: (node) => {
          // Skip hidden elements if needed
          return true;
        },
      });
  
      // Create PDF
      const doc = new jsPDF("p", "pt", "a4");
      doc.setFontSize(18);
      doc.text(`ESG Summary Report - ${selectedYear}`, 14, 22);
  
      // Add image to PDF
      doc.addImage(dataUrl, "PNG", 14, 40, 580, 0);
      doc.save(`ESG_${selectedYear}.pdf`);
    } catch (err) {
      console.error("Error exporting PDF:", err);
      alert("Failed to generate PDF. Try again.");
    }
  };
  


  const handleExport = (format: string) => {
    if (format === "PDF") exportPDF();
    else if (format === "CSV") exportCSV();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mt-[100px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            ESG Summary Dashboard
          </h1>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Download size={16} /> Export
              <ChevronDown
                size={16}
                className={`transform transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {["CSV", "PDF"].map((format) => (
                  <button
                    key={format}
                    onClick={() => {
                      handleExport(format);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50"
                  >
                    {format}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Metrics + Charts */}
      <div ref={dashboardRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Factory size={20} />}
            title="Carbon Intensity"
            value={calculatedMetrics.carbonIntensity}
            unit="T CO₂e/M INR"
            color="red"
          />
          <StatCard
            icon={<Zap size={20} />}
            title="Renewable Energy"
            value={calculatedMetrics.renewableRatio}
            unit="%"
            color="emerald"
          />
          <StatCard
            icon={<Users size={20} />}
            title="Gender Diversity"
            value={calculatedMetrics.diversityRatio}
            unit="%"
            color="purple"
          />
          <StatCard
            icon={<DollarSign size={20} />}
            title="Community Investment"
            value={calculatedMetrics.communitySpendRatio}
            unit="% of Revenue"
            color="orange"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Multi-Year Trends */}
          {data.length > 1 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp size={24} className="text-emerald-600" />
                ESG Metrics Trends
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="year" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="Renewable %"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Diversity %"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Community Spend %"
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Electricity Mix */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Zap size={24} className="text-emerald-600" />
              Electricity Mix ({selectedYear})
            </h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}\n${percentage}%`}
                  outerRadius={120}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [
                    `${val.toLocaleString()} kWh`,
                    "",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-emerald-500 rounded"></div>
                <span className="text-sm text-gray-600">Renewable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">Non-Renewable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Individual Bar Charts for Current Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Carbon Intensity ({selectedYear})
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: selectedYear?.toString(),
                    value: currentData.carbonIntensity
                      ? currentData.carbonIntensity * 1000000
                      : 0,
                  },
                ]}
              >
                <XAxis dataKey="name" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  formatter={(val: number) => [
                    `${val.toFixed(2)}`,
                    "T CO₂e/M INR",
                  ]}
                />
                <Bar
                  dataKey="value"
                  fill="#EF4444"
                  name="Carbon Intensity"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Diversity Ratio ({selectedYear})
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: selectedYear?.toString(),
                    value: currentData.diversityRatio
                      ? currentData.diversityRatio * 100
                      : 0,
                  },
                ]}
              >
                <XAxis dataKey="name" stroke="#666" />
                <YAxis unit="%" stroke="#666" />
                <Tooltip
                  formatter={(val: number) => [`${val.toFixed(1)}%`, ""]}
                />
                <Bar
                  dataKey="value"
                  fill="#8B5CF6"
                  name="Diversity Ratio"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Community Spend Ratio ({selectedYear})
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  {
                    name: selectedYear?.toString(),
                    value: currentData.communitySpendRatio
                      ? currentData.communitySpendRatio * 100
                      : 0,
                  },
                ]}
              >
                <XAxis dataKey="name" stroke="#666" />
                <YAxis unit="%" stroke="#666" />
                <Tooltip
                  formatter={(val: number) => [`${val.toFixed(2)}%`, ""]}
                />
                <Bar
                  dataKey="value"
                  fill="#F59E0B"
                  name="Community Spend Ratio"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Key Statistics ({selectedYear})
            </h3>
            <div className="space-y-4">
              <div className="text-sm text-gray-500 mb-4">
                Showing data for:{" "}
                <span className="font-medium text-emerald-600">
                  {selectedYear}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Total Employees</span>
                <span className="font-semibold">
                  {currentData.totalEmployees?.toLocaleString() || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Average Training Hours</span>
                <span className="font-semibold">
                  {currentData.averageTrainingHours
                    ? `${currentData.averageTrainingHours} hrs`
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Independent Board Members</span>
                <span className="font-semibold">
                  {currentData.independentBoardMembers || "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Data Privacy Policy</span>
                <span className="flex items-center gap-1">
                  {currentData.hasDataPrivacyPolicy ? (
                    <>
                      <CheckCircle size={16} className="text-emerald-500" /> Yes
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} className="text-red-500" /> No
                    </>
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Total Revenue</span>
                <span className="font-semibold">
                  {currentData.totalRevenue
                    ? `₹${(currentData.totalRevenue / 1000000).toFixed(1)}M`
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Carbon Emissions</span>
                <span className="font-semibold">
                  {currentData.carbonEmissions
                    ? `${currentData.carbonEmissions.toLocaleString()} T CO₂e`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
