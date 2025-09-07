"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return null; // wait until auth is loaded

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-lg shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
              🌿
            </div>
            <span className="text-2xl font-bold text-gray-900">Oren</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {!user ? (
              <>
                <Link href="#features" className="nav-link">
                  Features
                </Link>
                <Link href="#how-it-works" className="nav-link">
                  How It Works
                </Link>
                <Link href="/auth/login" className="nav-link">
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link href="/questionnaire" className="nav-link">
                    Add ESG data 
                  </Link>
                  <Link href="/summary" className="nav-link">
                    Summary
                  </Link>
                  <Link href="/responses" className="nav-link">
                    My responses
                  </Link>
                <button onClick={logout} className="text-red-500 hover:text-red-700 font-medium">
                  Logout
                </button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white shadow-lg border-t border-gray-200">
            <div className="flex flex-col gap-4 p-4">
              {!user ? (
                <>
                  <Link href="#features" className="nav-link">
                    Features
                  </Link>
                  <Link href="#how-it-works" className="nav-link">
                    How It Works
                  </Link>
                  <Link href="/auth/login" className="nav-link">
                    Login
                  </Link>
                  <Link href="/auth/register" className="btn-primary text-center">
                    Get Started
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link href="/ questionnaire" className="nav-link">
                    Add ESG data 
                  </Link>
                  <Link href="/summary" className="nav-link">
                    Summary
                  </Link>


                  
                  <button onClick={logout} className="text-red-500 hover:text-red-700 font-medium text-left">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

