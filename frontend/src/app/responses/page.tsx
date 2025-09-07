'use client';

import React, { useEffect, useState } from "react";
import { Loader, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Response {
  id: string;
  year: number;
  data: Record<string, string | number | boolean>; // safer than `any`
  createdAt: string;
}

export default function ResponsesPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResponses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Authentication token missing");

      const res = await fetch(`${API_URL}/api/responses`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch responses");

      const data: Response[] = await res.json();
      setResponses(data);

      if (data.length > 0) setSelectedYear(data[0].year); // default latest year
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      console.error(err);
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const selectedResponse = responses.find((r) => r.year === selectedYear);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin h-12 w-12 text-emerald-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold">{error}</h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 mt-[100px]">Your ESG Responses</h1>

      {/* Year Selector */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Select Year:</label>
        <select
          className="border border-gray-300 rounded-md p-2"
          value={selectedYear || undefined}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {responses.map((r) => (
            <option key={r.year} value={r.year}>
              {r.year}
            </option>
          ))}
        </select>
      </div>

      {/* Response Details */}
      {selectedResponse ? (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Response for {selectedResponse.year}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(selectedResponse.data).map(([key, value]) => (
              <div key={key} className="flex justify-between border-b py-2">
                <span className="font-medium text-gray-600">{key}</span>
                <span className="text-gray-900">{value?.toString() ?? "N/A"}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Submitted on: {new Date(selectedResponse.createdAt).toLocaleDateString()}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No response selected.</p>
      )}
    </div>
  );
}
