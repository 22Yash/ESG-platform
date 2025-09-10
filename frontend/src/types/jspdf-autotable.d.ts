import "jspdf";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    getAutoTable: () => any;
    getAutoTableList?: () => any[];
  }
}
