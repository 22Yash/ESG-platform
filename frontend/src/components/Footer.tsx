import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center text-white font-bold">
                🌿
              </div>
              <span className="text-2xl font-bold text-white">Oren</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
              Transforming ESG reporting with AI-powered insights, automated compliance, 
              and expert guidance for sustainable business growth.
            </p>
            <div className="flex gap-4">
              <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-slate-300">𝕏</span>
              </button>
              <button className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-slate-300">in</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-slate-400 hover:text-emerald-400 transition-colors">Features</a></li>
              <li><a href="/dashboard" className="text-slate-400 hover:text-emerald-400 transition-colors">Dashboard</a></li>
              <li><a href="/reports" className="text-slate-400 hover:text-emerald-400 transition-colors">Reports</a></li>
              <li><a href="/integrations" className="text-slate-400 hover:text-emerald-400 transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">About</a></li>
              <li><a href="/contact" className="text-slate-400 hover:text-emerald-400 transition-colors">Contact</a></li>
              <li><a href="/careers" className="text-slate-400 hover:text-emerald-400 transition-colors">Careers</a></li>
              <li><a href="/privacy" className="text-slate-400 hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Oren ESG Platform. All rights reserved.
          </p>
          <p className="text-slate-500 text-sm">
            Built with Next.js & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}