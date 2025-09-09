"use client";

import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import {
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
  TrendingUp,
  Users,
  Zap,
  Factory,
  DollarSign,
  AlertCircle,
  Loader,
  ChevronDown,
} from "lucide-react";

import { exportESG } from "@/utils/exportESG";
import { ESGResponse } from "@/types/esg";   // ✅ import shared type
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit?: string;
  color?: "emerald" | "blue" | "purple" | "orange" | "red";
}

export default function SummaryPage() {
  const [data, setData] = useState<ESGResponse[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchESGData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token missing");

        const response = await fetch(`${API_URL}/esg`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const resData: ESGResponse[] = await response.json();

        // ✅ Convert date strings → Date
        const normalized = resData.map((d) => ({
          ...d,
          createdAt: d.createdAt ? new Date(d.createdAt) : undefined,
          updatedAt: d.updatedAt ? new Date(d.updatedAt) : undefined,
        }));

        if (!normalized || normalized.length === 0) {
          setError("No ESG data found.");
        } else {
          const sortedData = normalized.sort((a, b) => b.year - a.year);
          setData(sortedData);
          if (selectedYear === null) setSelectedYear(sortedData[0].year);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Failed to fetch ESG data";
        toast.error(message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchESGData();
  }, []); // ✅ ignore selectedYear to silence ESLint

  const currentData = data.find((d) => d.year === selectedYear);
  const years = Array.from(new Set(data.map((d) => d.year))).sort(
    (a, b) => b - a
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin h-12 w-12 text-emerald-600" />
      </div>
    );

  if (error || !currentData)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold">{error || "No data"}</h2>
      </div>
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

  const StatCard = ({
    icon,
    title,
    value,
    unit,
    color = "emerald",
  }: StatCardProps) => {
    const colorClasses: Record<string, string> = {
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
          {unit && (
            <span className="text-gray-500 text-sm font-medium">{unit}</span>
          )}
        </div>
      </div>
    );
  };

  const handleExport = (format: "PDF" | "CSV") => {
    if (!currentData || !selectedYear) return;

    const dataWithMetrics: ESGResponse = {
      ...currentData,
      calculatedMetrics: {
        carbonIntensity: currentData.carbonIntensity ?? 0,
        renewableElectricityRatio: currentData.renewableElectricityRatio ?? 0,
        diversityRatio: currentData.diversityRatio ?? 0,
        communitySpendRatio: currentData.communitySpendRatio ?? 0,
      },
    };

    exportESG(dataWithMetrics, selectedYear, format, dashboardRef.current);
  };

  const pieData = [
    {
      name: "Renewable",
      value: currentData.renewableElectricityConsumption || 0,
      fill: "#10B981",
    },
    {
      name: "Non-Renewable",
      value:
        (currentData.totalElectricityConsumption || 0) -
        (currentData.renewableElectricityConsumption || 0),
      fill: "#EF4444",
    },
  ];

  const trendData = data.map((d) => ({
    year: d.year,
    "Renewable %": d.renewableElectricityRatio
      ? d.renewableElectricityRatio * 100
      : 0,
    "Diversity %": d.diversityRatio ? d.diversityRatio * 100 : 0,
    "Community Spend %": d.communitySpendRatio
      ? d.communitySpendRatio * 100
      : 0,
  }));

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
                className={`transform transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {["CSV", "PDF"].map((format) => (
                  <button
                    key={format}
                    onClick={() => {
                      handleExport(format as "PDF" | "CSV");
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

      {/* Year Dropdown */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <label className="block text-gray-700 font-medium mb-2">
          Select Year:
        </label>
        <select
          value={selectedYear || ""}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-gray-300 rounded-md p-2"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Dashboard */}
      <div
        ref={dashboardRef}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
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
          {/* Trends LineChart */}
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

          {/* Electricity Mix PieChart */}
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
                  label={({ name, percent }) =>
                    `${name}\n${percent ? (percent * 100).toFixed(1) : 0}%`
                  } // ✅ fixed NaN issue
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
          </div>
        </div>
      </div>
    </div>
  );
}
