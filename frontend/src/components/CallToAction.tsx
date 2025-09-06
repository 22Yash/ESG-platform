import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-[40px]"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-teal-500/10 rounded-full blur-[36px]"></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
          Ready to Transform Your{" "}
          <span className="text-emerald-400">ESG Journey</span>?
        </h2>
        <p className="text-xl text-gray-900 mb-8 leading-relaxed">
          Join the sustainability revolution with AI-powered insights, automated
          reporting, and expert guidance. Start your ESG transformation today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center gap-2 text-lg">
            <Link href="/auth/register">Start Free Trial  </Link>
            
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/20">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">100+</div>
            <div className="text-gray-600">Companies Trust Us</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">95%</div>
            <div className="text-gray-600">Time Savings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">24/7</div>
            <div className="text-gray-600">Expert Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
