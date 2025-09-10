// src/utils/exportESG.ts
import jsPDF from "jspdf";
import autoTable, { UserOptions } from "jspdf-autotable";
import html2canvas from "html2canvas";
import Papa from "papaparse";
import { ESGResponse } from "../types/esg";

export const exportESG = async (
  data: ESGResponse,
  year: number,
  format: "PDF" | "CSV",
  chartRef?: HTMLDivElement | null
) => {
  if (!data || !year) return;

  // PDF Export
  if (format === "PDF") {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    // Header
    doc.setFontSize(18);
    doc.text("ESG Summary Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Financial Year: ${year}`, 14, 30);
    doc.text(`Generated on: ${today}`, 14, 36);

    // Key Metrics
    const keyMetrics: [string, string][] = [
      [
        "Carbon Intensity",
        data.carbonIntensity
          ? `${(data.carbonIntensity * 1000000).toFixed(2)} T CO₂e / INR`
          : "N/A",
      ],
      [
        "Renewable Energy",
        data.renewableElectricityRatio
          ? `${(data.renewableElectricityRatio * 100).toFixed(1)}%`
          : "N/A",
      ],
      [
        "Diversity Ratio",
        data.diversityRatio
          ? `${(data.diversityRatio * 100).toFixed(1)}%`
          : "N/A",
      ],
      [
        "Community Spend",
        data.communitySpendRatio
          ? `${(data.communitySpendRatio * 100).toFixed(2)}%`
          : "N/A",
      ],
    ];

    autoTable(doc, {
      startY: 50,
      head: [["Metric", "Value"]],
      body: keyMetrics,
      theme: "grid",
      styles: { fontSize: 11 },
      headStyles: { fillColor: [16, 185, 129] },
    } as UserOptions);

    // ✅ Use lastAutoTable instead of getAutoTableList
    const lastTable = (doc as any).lastAutoTable;
    const startY = lastTable?.finalY ?? 60;

    // Detailed Metrics
    const detailedMetrics: [string, string, string, string][] = [
      ["Category", "Metric", "Value", "Unit"],
      [
        "Environmental",
        "Total Electricity Consumption",
        data.totalElectricityConsumption?.toLocaleString() || "N/A",
        "kWh",
      ],
      [
        "Environmental",
        "Renewable Electricity",
        data.renewableElectricityConsumption?.toLocaleString() || "N/A",
        "kWh",
      ],
      [
        "Environmental",
        "Carbon Emissions",
        data.carbonEmissions?.toFixed(2) || "0.00",
        "T CO₂e",
      ],
      [
        "Social",
        "Total Employees",
        data.totalEmployees?.toLocaleString() || "0",
        "Count",
      ],
      [
        "Social",
        "Female Employees",
        data.femaleEmployees?.toLocaleString() || "N/A",
        "Count",
      ],
      [
        "Social",
        "Average Training Hours",
        data.averageTrainingHours?.toString() || "N/A",
        "Hours",
      ],
      [
        "Social",
        "Community Investment",
        data.communityInvestment?.toLocaleString() || "N/A",
        "INR",
      ],
      [
        "Governance",
        "Independent Board Members",
        data.independentBoardMembers?.toString() || "0",
        "%",
      ],
      [
        "Governance",
        "Data Privacy Policy",
        data.hasDataPrivacyPolicy ? "Yes" : "No",
        "",
      ],
      [
        "Financial",
        "Total Revenue",
        data.totalRevenue
          ? `₹${(data.totalRevenue / 1000000).toFixed(1)}M`
          : "N/A",
        "INR",
      ],
    ];

    autoTable(doc, {
      startY: startY + 5,
      head: [detailedMetrics[0]],
      body: detailedMetrics.slice(1),
      theme: "grid",
      styles: { fontSize: 11 },
      headStyles: { fillColor: [16, 185, 129] },
    } as UserOptions);

    // Chart Image (if provided)
    if (chartRef) {
      try {
        const canvas = await html2canvas(chartRef, {
          scale: 1.5,
          backgroundColor: "#ffffff",
        });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pageHeight = doc.internal.pageSize.height;
        const yAfterTable =
          ((doc as any).lastAutoTable?.finalY ?? 60) +
          detailedMetrics.length * 10 +
          15;

        if (yAfterTable + imgHeight > pageHeight - 20) {
          doc.addPage();
          doc.addImage(imgData, "PNG", 14, 20, imgWidth, imgHeight);
        } else {
          doc.addImage(imgData, "PNG", 14, yAfterTable, imgWidth, imgHeight);
        }
      } catch (error) {
        console.error("Error capturing chart:", error);
        doc.setFontSize(12);
        doc.text(
          "Charts could not be included in PDF export.",
          14,
          startY + 250
        );
      }
    }

    doc.save(`ESG_Summary_${year}.pdf`);
  }

  // CSV Export
  if (format === "CSV") {
    const csvData = [
      {
        Year: year,
        Metric: "Carbon Intensity",
        Value: data.carbonIntensity
          ? (data.carbonIntensity * 1000000).toFixed(2)
          : "N/A",
        Unit: "T CO₂e / INR",
        Category: "Environmental",
      },
      {
        Year: year,
        Metric: "Renewable Energy",
        Value: data.renewableElectricityRatio
          ? (data.renewableElectricityRatio * 100).toFixed(1)
          : "N/A",
        Unit: "%",
        Category: "Environmental",
      },
      {
        Year: year,
        Metric: "Diversity Ratio",
        Value: data.diversityRatio
          ? (data.diversityRatio * 100).toFixed(1)
          : "N/A",
        Unit: "%",
        Category: "Social",
      },
      {
        Year: year,
        Metric: "Community Spend",
        Value: data.communitySpendRatio
          ? (data.communitySpendRatio * 100).toFixed(2)
          : "N/A",
        Unit: "% of Revenue",
        Category: "Social",
      },
      {
        Year: year,
        Metric: "Total Electricity Consumption",
        Value: data.totalElectricityConsumption?.toLocaleString() || "N/A",
        Unit: "kWh",
        Category: "Environmental",
      },
      {
        Year: year,
        Metric: "Renewable Electricity",
        Value: data.renewableElectricityConsumption?.toLocaleString() || "N/A",
        Unit: "kWh",
        Category: "Environmental",
      },
      {
        Year: year,
        Metric: "Carbon Emissions",
        Value: data.carbonEmissions?.toFixed(2) || "0.00",
        Unit: "T CO₂e",
        Category: "Environmental",
      },
      {
        Year: year,
        Metric: "Total Employees",
        Value: data.totalEmployees?.toLocaleString() || "0",
        Unit: "Count",
        Category: "Social",
      },
      {
        Year: year,
        Metric: "Female Employees",
        Value: data.femaleEmployees?.toLocaleString() || "N/A",
        Unit: "Count",
        Category: "Social",
      },
      {
        Year: year,
        Metric: "Average Training Hours",
        Value: data.averageTrainingHours?.toString() || "N/A",
        Unit: "Hours",
        Category: "Social",
      },
      {
        Year: year,
        Metric: "Community Investment",
        Value: data.communityInvestment?.toLocaleString() || "N/A",
        Unit: "INR",
        Category: "Social",
      },
      {
        Year: year,
        Metric: "Independent Board Members",
        Value: data.independentBoardMembers?.toString() || "0",
        Unit: "Count",
        Category: "Governance",
      },
      {
        Year: year,
        Metric: "Data Privacy Policy",
        Value: data.hasDataPrivacyPolicy ? "Yes" : "No",
        Unit: "Boolean",
        Category: "Governance",
      },
      {
        Year: year,
        Metric: "Total Revenue",
        Value: data.totalRevenue
          ? (data.totalRevenue / 1000000).toFixed(1)
          : "N/A",
        Unit: "Million INR",
        Category: "Financial",
      },
    ];

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", `ESG_Summary_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
