// src/app/questionnaire/layout.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface QuestionnaireLayoutProps {
  children: React.ReactNode;
}

const QuestionnaireLayout: React.FC<QuestionnaireLayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const token = localStorage.getItem('token');
        
  //       if (!token) {
  //         router.push('/auth/login');
  //         return;
  //       }

  //       // Verify token with backend
  //       const response = await fetch('/api/auth/verify', {
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       });

  //       if (response.ok) {
  //         setIsAuthenticated(true);
  //       } else {
  //         localStorage.removeItem('token');
  //         router.push('/auth/login');
  //       }
  //     } catch (error) {
  //       console.error('Auth check failed:', error);
  //       localStorage.removeItem('token');
  //       router.push('/auth/login');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   checkAuth();
  // }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Router will handle redirect
  }

  return <>{children}</>;
};

export default QuestionnaireLayout;