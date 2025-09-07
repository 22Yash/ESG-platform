// /utils/exportESG.ts
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { ESGResponse } from '../types/esg'; // adjust import path

export const exportESG = (data: ESGResponse, year: number, format: 'PDF' | 'CSV') => {
  if (!data || !year) return;

  if (format === 'PDF') {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    // Header
    doc.setFontSize(18);
    doc.text('ESG Summary Report', 14, 20);
    doc.setFontSize(12);
    doc.text(`Financial Year: ${year}`, 14, 30);
    doc.text(`Generated on: ${today}`, 14, 36);

    // Key Performance Metrics
    const keyMetrics = [
      ['Carbon Intensity', data.carbonIntensity ? `${(data.carbonIntensity * 1000000).toFixed(2)} T CO₂e / INR` : 'N/A'],
      ['Renewable Energy', data.renewableElectricityRatio ? `${(data.renewableElectricityRatio * 100).toFixed(1)}%` : 'N/A'],
      ['Diversity Ratio', data.diversityRatio ? `${(data.diversityRatio * 100).toFixed(1)}%` : 'N/A'],
      ['Community Spend', data.communitySpendRatio ? `${(data.communitySpendRatio * 100).toFixed(2)}%` : 'N/A'],
    ];

    doc.autoTable({
      startY: 50,
      head: [['Metric', 'Value']],
      body: keyMetrics,
      theme: 'grid',
      styles: { fontSize: 11 },
      headStyles: { fillColor: [16, 185, 129] },
    });

    // Detailed Metrics
    const startY = doc.lastAutoTable.finalY + 10;
    const detailedMetrics = [
      ['Category', 'Metric', 'Value', 'Unit'],
      ['Environmental', 'Total Electricity Consumption', data.totalElectricityConsumption?.toLocaleString() || 'N/A', 'kWh'],
      ['Environmental', 'Renewable Electricity', data.renewableElectricityConsumption?.toLocaleString() || 'N/A', 'kWh'],
      ['Environmental', 'Carbon Emissions', data.carbonEmissions?.toFixed(2) || '0.00', 'T CO₂e'],
      ['Social', 'Total Employees', data.totalEmployees?.toLocaleString() || '0', ''],
      ['Social', 'Female Employees', data.femaleEmployees?.toLocaleString() || 'N/A', ''],
      ['Social', 'Average Training Hours', data.averageTrainingHours?.toString() || 'N/A', 'Hours'],
      ['Social', 'Community Investment', data.communityInvestment?.toLocaleString() || 'N/A', 'INR'],
      ['Governance', 'Independent Board Members', data.independentBoardMembers?.toString() || '0', '%'],
      ['Governance', 'Data Privacy Policy', data.hasDataPrivacyPolicy ? 'Yes' : 'No', ''],
      ['Financial', 'Total Revenue', data.totalRevenue ? `₹${(data.totalRevenue / 1000000).toFixed(1)}M` : 'N/A', 'INR'],
    ];

    doc.autoTable({
      startY: startY + 5,
      head: [detailedMetrics[0]],
      body: detailedMetrics.slice(1),
      theme: 'grid',
      styles: { fontSize: 11 },
      headStyles: { fillColor: [16, 185, 129] },
    });

    doc.save(`ESG_Summary_${year}.pdf`);
  }

  if (format === 'CSV') {
    const csvData = [
      { Metric: 'Carbon Intensity', Value: data.carbonIntensity ? (data.carbonIntensity * 1000000).toFixed(2) : 'N/A', Unit: 'T CO₂e / INR' },
      { Metric: 'Renewable Energy', Value: data.renewableElectricityRatio ? (data.renewableElectricityRatio * 100).toFixed(1) : 'N/A', Unit: '%' },
      { Metric: 'Diversity Ratio', Value: data.diversityRatio ? (data.diversityRatio * 100).toFixed(1) : 'N/A', Unit: '%' },
      { Metric: 'Community Spend', Value: data.communitySpendRatio ? (data.communitySpendRatio * 100).toFixed(2) : 'N/A', Unit: '% of Revenue' },
      // You can add detailed metrics here for CSV if needed
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `ESG_Summary_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
