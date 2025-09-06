"use client";

import React, { useState } from 'react';
import { ArrowRight, Play, Globe } from 'lucide-react';

export default function Hero() {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center space-y-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              <Globe size={16} />
              Trusted by 100+ companies worldwide
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
              All Your <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Sustainability Data</span><br />
              and <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Stakeholders Connected</span><br />
              <span className="text-gray-700">in One Place</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your ESG journey with AI-powered insights, automated reporting, and real-time analytics. 
              From data collection to compliance-ready reports, we've got you covered.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center gap-2 text-lg">
              Request a Demo
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setVideoPlaying(true)}
              className="group px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-emerald-600 hover:text-emerald-600 transition-all duration-200 font-semibold flex items-center gap-2 text-lg"
            >
              <Play size={20} />
              Watch Demo
            </button>
          </div>

          
        </div>
      </div>
    </section>
  );
}