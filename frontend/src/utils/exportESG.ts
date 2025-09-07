import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

  if (format === "PDF") {
    const doc = new jsPDF();
    const today = new Date().toLocaleDateString();

    // Header
    doc.setFontSize(18);
    doc.text("ESG Summary Report", 14, 20);
    doc.setFontSize(12);
    doc.text(`Financial Year: ${year}`, 14, 30);
    doc.text(`Generated on: ${today}`, 14, 36);

    // Key Performance Metrics
    const keyMetrics = [
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
    });

    // Detailed Metrics
    const startY = (doc as any).lastAutoTable.finalY + 10;
    const detailedMetrics = [
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
      ["Social", "Total Employees", data.totalEmployees?.toLocaleString() || "0", ""],
      [
        "Social",
        "Female Employees",
        data.femaleEmployees?.toLocaleString() || "N/A",
        "",
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
      ["Governance", "Data Privacy Policy", data.hasDataPrivacyPolicy ? "Yes" : "No", ""],
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
    });

    // Add Chart Image (if provided) with better error handling
    if (chartRef) {
      try {
        const yAfterTable = (doc as any).lastAutoTable.finalY + 15;

        // Clone the element and replace unsupported colors
        const clonedRef = chartRef.cloneNode(true) as HTMLDivElement;
        document.body.appendChild(clonedRef);
        
        // Style the cloned element to be invisible but rendered
        clonedRef.style.position = 'absolute';
        clonedRef.style.left = '-9999px';
        clonedRef.style.top = '-9999px';
        clonedRef.style.backgroundColor = '#ffffff';
        
        // Replace any problematic color functions with fallbacks
        const elements = clonedRef.querySelectorAll('*');
        elements.forEach((el: Element) => {
          const element = el as HTMLElement;
          const computedStyle = window.getComputedStyle(element);
          
          // Replace problematic colors with safe fallbacks
          if (computedStyle.backgroundColor && computedStyle.backgroundColor.includes('oklch')) {
            element.style.backgroundColor = '#ffffff';
          }
          if (computedStyle.color && computedStyle.color.includes('oklch')) {
            element.style.color = '#000000';
          }
          if (computedStyle.borderColor && computedStyle.borderColor.includes('oklch')) {
            element.style.borderColor = '#e5e5e5';
          }
        });

        const canvas = await html2canvas(clonedRef, {
          scale: 1.5,
          backgroundColor: "#ffffff",
          useCORS: true,
          allowTaint: false,
          scrollX: 0,
          scrollY: 0,
          width: clonedRef.scrollWidth,
          height: clonedRef.scrollHeight,
          onclone: (clonedDoc) => {
            // Additional cleanup for cloned document
            const clonedElements = clonedDoc.querySelectorAll('*');
            clonedElements.forEach((el: Element) => {
              const element = el as HTMLElement;
              // Force specific colors to avoid oklch issues
              if (element.style.backgroundColor?.includes('oklch')) {
                element.style.backgroundColor = '#ffffff';
              }
              if (element.style.color?.includes('oklch')) {
                element.style.color = '#000000';
              }
            });
          }
        });

        // Remove the cloned element
        document.body.removeChild(clonedRef);

        const imgData = canvas.toDataURL("image/png", 0.8);
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Check if we need a new page
        const pageHeight = doc.internal.pageSize.height;
        if (yAfterTable + imgHeight > pageHeight - 20) {
          doc.addPage();
          doc.addImage(imgData, "PNG", 14, 20, imgWidth, imgHeight);
        } else {
          doc.addImage(imgData, "PNG", 14, yAfterTable, imgWidth, imgHeight);
        }
      } catch (error) {
        console.error("Error capturing charts for PDF:", error);
        
        // Add a fallback text instead of the image
        const yAfterTable = (doc as any).lastAutoTable.finalY + 15;
        doc.setFontSize(12);
        doc.text("Charts could not be included in PDF export.", 14, yAfterTable);
        doc.setFontSize(10);
        doc.text("Note: Chart visualization failed due to browser compatibility issues.", 14, yAfterTable + 10);
      }
    }

    doc.save(`ESG_Summary_${year}.pdf`);
  }

  if (format === "CSV") {
    const csvData = [
      {
        Year: year,
        Metric: "Carbon Intensity",
        Value: data.carbonIntensity
          ? (data.carbonIntensity * 1000000).toFixed(2)
          : "N/A",
        Unit: "T CO₂e / INR",
        Category: "Environmental"
      },
      {
        Year: year,
        Metric: "Renewable Energy",
        Value: data.renewableElectricityRatio
          ? (data.renewableElectricityRatio * 100).toFixed(1)
          : "N/A",
        Unit: "%",
        Category: "Environmental"
      },
      {
        Year: year,
        Metric: "Diversity Ratio",
        Value: data.diversityRatio
          ? (data.diversityRatio * 100).toFixed(1)
          : "N/A",
        Unit: "%",
        Category: "Social"
      },
      {
        Year: year,
        Metric: "Community Spend",
        Value: data.communitySpendRatio
          ? (data.communitySpendRatio * 100).toFixed(2)
          : "N/A",
        Unit: "% of Revenue",
        Category: "Social"
      },
      {
        Year: year,
        Metric: "Total Electricity Consumption",
        Value: data.totalElectricityConsumption?.toLocaleString() || "N/A",
        Unit: "kWh",
        Category: "Environmental"
      },
      {
        Year: year,
        Metric: "Renewable Electricity",
        Value: data.renewableElectricityConsumption?.toLocaleString() || "N/A",
        Unit: "kWh",
        Category: "Environmental"
      },
      {
        Year: year,
        Metric: "Carbon Emissions",
        Value: data.carbonEmissions?.toFixed(2) || "0.00",
        Unit: "T CO₂e",
        Category: "Environmental"
      },
      {
        Year: year,
        Metric: "Total Employees",
        Value: data.totalEmployees?.toLocaleString() || "0",
        Unit: "Count",
        Category: "Social"
      },
      {
        Year: year,
        Metric: "Female Employees",
        Value: data.femaleEmployees?.toLocaleString() || "N/A",
        Unit: "Count",
        Category: "Social"
      },
      {
        Year: year,
        Metric: "Average Training Hours",
        Value: data.averageTrainingHours?.toString() || "N/A",
        Unit: "Hours",
        Category: "Social"
      },
      {
        Year: year,
        Metric: "Community Investment",
        Value: data.communityInvestment?.toLocaleString() || "N/A",
        Unit: "INR",
        Category: "Social"
      },
      {
        Year: year,
        Metric: "Independent Board Members",
        Value: data.independentBoardMembers?.toString() || "0",
        Unit: "Count",
        Category: "Governance"
      },
      {
        Year: year,
        Metric: "Data Privacy Policy",
        Value: data.hasDataPrivacyPolicy ? "Yes" : "No",
        Unit: "Boolean",
        Category: "Governance"
      },
      {
        Year: year,
        Metric: "Total Revenue",
        Value: data.totalRevenue
          ? (data.totalRevenue / 1000000).toFixed(1)
          : "N/A",
        Unit: "Million INR",
        Category: "Financial"
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