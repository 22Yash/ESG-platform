import React from 'react';
import { UserPlus, FileText, BarChart3, Zap } from 'lucide-react';

const steps = [
  { 
    step: "01", 
    title: "Sign Up & Login", 
    description: "Create your account with name, email, and password. Simple registration to get started with your ESG data tracking.",
    icon: <UserPlus size={24} />
  },
  { 
    step: "02", 
    title: "Fill Questionnaire", 
    description: "Enter your ESG data across 11 key metrics for multiple financial years. Watch as ratios are calculated automatically in real-time.",
    icon: <FileText size={24} />
  },
  { 
    step: "03", 
    title: "View Summary & Export", 
    description: "Access your dashboard with charts and summaries. Download your data and calculated metrics as PDF or Excel files.",
    icon: <BarChart3 size={24} />
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <Zap size={16} />
            Simple & Straightforward
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Get Started in <span className="text-blue-600">3 Simple Steps</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Our straightforward process gets you tracking your ESG metrics and generating summaries quickly and easily.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-2 border-dashed border-emerald-300"></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto shadow-lg group-hover:scale-110 transition-transform duration-200">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-800 font-bold text-sm">{step.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

      
      </div>
    </section>
  );
}