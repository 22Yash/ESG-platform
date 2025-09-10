"use client";
import React, { useState } from "react";
import toast from "react-hot-toast";
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
import { 
  Calculator, 
  Save, 
  FileText, 
  Leaf, 
  Users, 
  Building, 
  Calendar,
  TrendingUp,
  BarChart3,
  Shield,
  Award,
  ChevronRight,
  Download,
  RefreshCw
} from "lucide-react";

type FormDataType = {
  year: string;
  totalElectricityConsumption: string;
  renewableElectricityConsumption: string;
  totalFuelConsumption: string;
  carbonEmissions: string;
  totalEmployees: string;
  femaleEmployees: string;
  averageTrainingHours: string;
  communityInvestment: string;
  independentBoardMembers: string;
  hasDataPrivacyPolicy: string;
  totalRevenue: string;
};

export default function QuestionnairePage() {
  const [formData, setFormData] = useState<FormDataType>({
    year: new Date().getFullYear().toString(),
    totalElectricityConsumption: "",
    renewableElectricityConsumption: "",
    totalFuelConsumption: "",
    carbonEmissions: "",
    totalEmployees: "",
    femaleEmployees: "",
    averageTrainingHours: "",
    communityInvestment: "",
    independentBoardMembers: "",
    hasDataPrivacyPolicy: "No",
    totalRevenue: ""
  });

  const [activeSection, setActiveSection] = useState("year");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  };

  const calculations = {
    carbonIntensity: formData.totalRevenue && formData.carbonEmissions 
      ? ((parseFloat(formData.carbonEmissions) / parseFloat(formData.totalRevenue)) * 1000000).toFixed(4)
      : "0.0000",
  
    renewableRatio: formData.totalElectricityConsumption && formData.renewableElectricityConsumption
      ? ((parseFloat(formData.renewableElectricityConsumption) / parseFloat(formData.totalElectricityConsumption)) * 100).toFixed(1)
      : "0.0",
  
    diversityRatio: formData.totalEmployees && formData.femaleEmployees
      ? ((parseFloat(formData.femaleEmployees) / parseFloat(formData.totalEmployees)) * 100).toFixed(1)
      : "0.0",
  
    communityRatio: formData.totalRevenue && formData.communityInvestment
      ? ((parseFloat(formData.communityInvestment) / parseFloat(formData.totalRevenue)) * 100).toFixed(2)
      : "0.00"
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const payload = {
        year: parseInt(formData.year),
        totalElectricityConsumption: parseFloat(formData.totalElectricityConsumption),
        renewableElectricityConsumption: parseFloat(formData.renewableElectricityConsumption),
        totalFuelConsumption: parseFloat(formData.totalFuelConsumption),
        carbonEmissions: parseFloat(formData.carbonEmissions),
        totalEmployees: parseInt(formData.totalEmployees),
        femaleEmployees: parseInt(formData.femaleEmployees),
        averageTrainingHours: parseFloat(formData.averageTrainingHours),
        communityInvestment: parseFloat(formData.communityInvestment),
        independentBoardMembers: parseFloat(formData.independentBoardMembers),
        hasDataPrivacyPolicy: formData.hasDataPrivacyPolicy === "Yes",
        totalRevenue: parseFloat(formData.totalRevenue),
      };
      
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to submit data");
        return;
      }

      const res = await fetch(`${API_URL}/esg`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to save ESG data");
        return;
      }
  
      const data = await res.json();
      console.log("ESG Response Saved:", data);
      toast.success("✅ ESG data submitted successfully!");
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("❌ Failed to submit ESG data");
    }
  };

  // -------------------------
  // Reusable Components
  // -------------------------

  type FormSectionProps = {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    sectionId: string;
  };
  
  const FormSection: React.FC<FormSectionProps> = ({ title, subtitle, icon, children, sectionId }) => (
    <div
      className={`bg-white border ${sectionId === activeSection ? 'border-blue-600 shadow-lg' : 'border-gray-200'} rounded-lg transition-all duration-200`}
      onClick={() => setActiveSection(sectionId)}
    >
      <div className="px-8 py-6 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="p-8">{children}</div>
    </div>
  );
  

  type InputFieldProps = {
    name: keyof FormDataType;
    label: string;
    type?: string;
    unit?: string;
    placeholder?: string;
    required?: boolean;
    isSelect?: boolean;
    options?: { value: string; label: string }[];
  };

  const InputField = ({
    name,
    label,
    type = "number",
    unit,
    placeholder,
    required = false,
    isSelect = false,
    options = []
  }: InputFieldProps) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-900">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
        {unit && <span className="text-gray-500 ml-1">({unit})</span>}
      </label>

      {isSelect ? (
        <select
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
          required={required}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          required={required}
        />
      )}
    </div>
  );

  type MetricCardProps = {
    title: string;
    value: string | number;
    unit?: string;
    change?: string | number;
    changeType?: "positive" | "negative" | "neutral";
  };

  const MetricCard = ({ title, value, unit, change, changeType = "neutral" }:MetricCardProps) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        {change && (
          <div className={`flex items-center text-sm ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
          }`}>
            <TrendingUp size={14} className={changeType === 'negative' ? 'rotate-180' : ''} />
            <span className="ml-1">{change}</span>
          </div>
        )}
      </div>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="text-gray-500 text-sm ml-2">{unit}</span>
      </div>
    </div>
  );

  // -------------------------
  // JSX Return (same as your original)
  // -------------------------

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 mt-[100px]" >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BarChart3 className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">ESG Data Management System</h1>
                <p className="text-gray-600">Environmental, Social & Governance Reporting Platform</p>
              </div>
            </div>
            
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <nav className="flex space-x-8" aria-label="Tabs">
                <button className="border-b-2 border-blue-500 pb-2 text-blue-600 font-medium">Data Entry</button>
                <button className="border-b-2 border-transparent pb-2 text-gray-500 hover:text-gray-700">Review</button>
                <button className="border-b-2 border-transparent pb-2 text-gray-500 hover:text-gray-700">Submit</button>
              </nav>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Year Selection */}
              <FormSection
                title="Reporting Period"
                subtitle="Select the fiscal year for ESG data collection"
                icon={<Calendar className="text-blue-600" size={20} />}
                sectionId="year"
              >
                <div className="max-w-xs">
                  <InputField
                    name="year"
                    label="Fiscal Year"
                    required={true}
                    isSelect={true}
                    options={generateYearOptions().map(year => ({ 
                      value: year.toString(), 
                      label: `FY ${year}` 
                    }))}
                  />
                </div>
              </FormSection>

              {/* Environmental Metrics */}
              <FormSection
                title="Environmental Metrics"
                subtitle="Energy consumption, emissions, and resource utilization"
                icon={<Leaf className="text-green-600" size={20} />}
                sectionId="environmental"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    name="totalElectricityConsumption"
                    label="Total Electricity Consumption"
                    unit="kWh"
                    placeholder="50000"
                    required={true}
                  />
                  <InputField
                    name="renewableElectricityConsumption"
                    label="Renewable Electricity"
                    unit="kWh"
                    placeholder="15000"
                    required={true}
                  />
                  <InputField
                    name="totalFuelConsumption"
                    label="Total Fuel Consumption"
                    unit="liters"
                    placeholder="8000"
                    required={true}
                  />
                  <InputField
                    name="carbonEmissions"
                    label="Total Carbon Emissions"
                    unit="T CO₂e"
                    placeholder="120"
                    required={true}
                  />
                </div>
              </FormSection>

              {/* Social Metrics */}
              <FormSection
                title="Social Metrics"
                subtitle="Workforce, diversity, training, and community engagement"
                icon={<Users className="text-blue-600" size={20} />}
                sectionId="social"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    name="totalEmployees"
                    label="Total Employees"
                    placeholder="250"
                    required={true}
                  />
                  <InputField
                    name="femaleEmployees"
                    label="Female Employees"
                    placeholder="95"
                    required={true}
                  />
                  <InputField
                    name="averageTrainingHours"
                    label="Average Training Hours"
                    unit="hours/employee/year"
                    placeholder="40"
                    required={true}
                  />
                  <InputField
                    name="communityInvestment"
                    label="Community Investment"
                    unit="INR"
                    placeholder="500000"
                    required={true}
                  />
                </div>
              </FormSection>

              {/* Governance Metrics */}
              <FormSection
                title="Governance Metrics"
                subtitle="Board structure, policies, and financial transparency"
                icon={<Building className="text-purple-600" size={20} />}
                sectionId="governance"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    name="independentBoardMembers"
                    label="Independent Board Members"
                    unit="%"
                    placeholder="60"
                    required={true}
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-900">
                      Data Privacy Policy <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="hasDataPrivacyPolicy"
                      value={formData.hasDataPrivacyPolicy}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      required
                    >
                      <option value="Yes">Yes - Policy implemented</option>
                      <option value="No">No - Policy not implemented</option>
                    </select>
                  </div>
                  <InputField
                    name="totalRevenue"
                    label="Total Revenue"
                    unit="INR"
                    placeholder="10000000"
                    required={true}
                  />
                </div>
              </FormSection>

              {/* Submit Section */}
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Submit ESG Data</h3>
                    <p className="text-gray-600">Review and submit your ESG metrics for FY {formData.year}</p>
                  </div>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Submit Report
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar - Calculated Metrics */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <Calculator className="text-gray-600" size={20} />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Key Performance Indicators</h3>
                    <p className="text-gray-600 text-sm">Auto-calculated ESG metrics</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <MetricCard
                  title="Carbon Intensity"
                  value={calculations.carbonIntensity}
                  unit="T CO₂e/INR"
                />
                <MetricCard
                  title="Renewable Energy Ratio"
                  value={`${calculations.renewableRatio}%`}
                  unit="of total consumption"
                />
                <MetricCard
                  title="Gender Diversity Ratio"
                  value={`${calculations.diversityRatio}%`}
                  unit="female representation"
                />
                <MetricCard
                  title="Community Investment Ratio"
                  value={`${calculations.communityRatio}%`}
                  unit="of total revenue"
                />
              </div>
            </div>

            {/* ESG Score Preview */}
            {/* <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Award className="text-orange-500" size={20} />
                <h3 className="text-lg font-semibold text-gray-900">ESG Score Preview</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Environmental</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-12 h-2 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">75/100</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Social</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-14 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">87/100</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Governance</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-gray-200 rounded-full">
                      <div className="w-10 h-2 bg-purple-500 rounded-full"></div>
                    </div>
                    <span className="text-sm font-medium">62/100</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Overall ESG Score</span>
                    <span className="text-xl font-bold text-blue-600">74.7</span>
                  </div>
                </div>
              </div>
            </div> */}

            {/* Quick Actions */}
            {/* <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                  <FileText size={16} className="text-gray-600" />
                  <span className="text-sm">View Previous Reports</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                  <RefreshCw size={16} className="text-gray-600" />
                  <span className="text-sm">Reset Form</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-left border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Shield size={16} className="text-gray-600" />
                  <span className="text-sm">Compliance Check</span>
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
