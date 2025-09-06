"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // 👈 import auth context

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth(); // 👈 get user + logout

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const guestLinks = (
    <>
      <Link
        href="#features"
        className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
      >
        Features
      </Link>
      <Link
        href="#how-it-works"
        className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
      >
        How It Works
      </Link>
      <div className="flex items-center gap-4 ml-4">
        <Link
          href="/auth/login"
          className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
        >
          Login
        </Link>
        <Link
          href="/auth/register"
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
        >
          Get Started
        </Link>
      </div>
    </>
  );

  const userLinks = (
    <>
      <Link
        href="/dashboard"
        className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
      >
        Dashboard
      </Link>
      <Link
        href="/account"
        className="text-gray-600 hover:text-emerald-600 transition-colors font-medium"
      >
        Account
      </Link>
      <button
        onClick={logout}
        className="text-red-500 hover:text-red-700 font-medium"
      >
        Logout
      </button>
    </>
  );

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
            {!user ? guestLinks : userLinks}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-6 space-y-4 flex flex-col">
              {!user ? guestLinks : userLinks}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
