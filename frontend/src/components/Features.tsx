import React from 'react';
import { Calculator, BarChart3, Download, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: <Calculator className="text-emerald-600" size={24} />,
    title: "Real-time Calculations",
    description: "Auto-compute ESG ratios like Carbon Intensity, Renewable Electricity Ratio, and Diversity Ratio as you enter data across multiple financial years.",
    highlight: "4 Auto-calculated Metrics"
  },
  {
    icon: <BarChart3 className="text-blue-600" size={24} />,
    title: "Summary Dashboard",
    description: "Visualize your ESG data with simple charts and comprehensive summaries. Track your performance across different financial years at a glance.",
    highlight: "Charts & Insights"
  },
  {
    icon: <Download className="text-indigo-600" size={24} />,
    title: "Export Reports",
    description: "Download your filled questionnaire and summary reports in PDF or Excel format for easy sharing and record-keeping.",
    highlight: "PDF & Excel Export"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium mb-4">
            <CheckCircle size={16} />
            Simple ESG Questionnaire
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Everything You Need for <span className="text-emerald-600">ESG Data Collection</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track 11 key ESG metrics across multiple financial years with automatic calculations 
            and easy-to-understand summaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gray-50 rounded-xl group-hover:scale-110 transition-transform duration-200">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                  </div>
                  <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full mb-3">
                    {feature.highlight}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}