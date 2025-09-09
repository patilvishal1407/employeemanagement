import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateEquipmentStatusPDF = (equipmentData) => {
  const pdf = new jsPDF();

  // Header
  pdf.setFillColor(44, 62, 80);
  pdf.rect(0, 0, 210, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MechCorp Manufacturing', 105, 15, { align: 'center' });

  pdf.setFontSize(12);
  pdf.text('Equipment Maintenance Tracker', 105, 22, { align: 'center' });

  // Reset colors
  pdf.setTextColor(0, 0, 0);
  pdf.setFillColor(255, 255, 255);

  // Report title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('EQUIPMENT STATUS REPORT', 20, 45);

  // Date
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(` ${new Date().toLocaleString()}`, 20, 52);

  // Table data
  const tableData = equipmentData.map(item => [
    item.name,
    item.type,
    item.status,
    item.lastMaintenanceDate ? new Date(item.lastMaintenanceDate).toLocaleDateString() : 'N/A',
    item.nextMaintenanceDate ? new Date(item.nextMaintenanceDate).toLocaleDateString() : 'N/A'
  ]);

  // Generate table
  autoTable(pdf, {
    head: [['Equipment Name', 'Type', 'Status', 'Last Maintenance', 'Next Maintenance']],
    body: tableData,
    startY: 60,
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [52, 73, 94],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [244, 246, 247],
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30 },
      2: { cellWidth: 30 },
      3: { cellWidth: 40 },
      4: { cellWidth: 40 },
    },
  });

  return pdf;
};

export const generateWorkOrderSummaryPDF = (workOrderData) => {
  const pdf = new jsPDF();

  // Header
  pdf.setFillColor(44, 62, 80);
  pdf.rect(0, 0, 210, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MechCorp Manufacturing', 105, 15, { align: 'center' });

  pdf.setFontSize(12);
  pdf.text('Equipment Maintenance Tracker', 105, 22, { align: 'center' });

  // Reset colors
  pdf.setTextColor(0, 0, 0);
  pdf.setFillColor(255, 255, 255);

  // Report title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('WORK ORDER SUMMARY', 20, 45);

  // Date
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(` ${new Date().toLocaleString()}`, 20, 52);

  // Table data
  const tableData = workOrderData.map(item => [
    item.title,
    item.equipment?.name || 'N/A',
    item.status,
    item.priority,
    item.assignedTechnician?.name || 'Unassigned',
    item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'
  ]);

  // Generate table
  autoTable(pdf, {
    head: [['Title', 'Equipment', 'Status', 'Priority', 'Assigned To', 'Due Date']],
    body: tableData,
    startY: 60,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [52, 73, 94],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [244, 246, 247],
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25 },
      3: { cellWidth: 20 },
      4: { cellWidth: 35 },
      5: { cellWidth: 30 },
    },
  });

  return pdf;
};

export const generateTechnicianWorkloadPDF = (workloadData) => {
  const pdf = new jsPDF();

  // Header
  pdf.setFillColor(44, 62, 80);
  pdf.rect(0, 0, 210, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('MechCorp Manufacturing', 105, 15, { align: 'center' });

  pdf.setFontSize(12);
  pdf.text('Equipment Maintenance Tracker', 105, 22, { align: 'center' });

  // Reset colors
  pdf.setTextColor(0, 0, 0);
  pdf.setFillColor(255, 255, 255);

  // Report title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('TECHNICIAN WORKLOAD', 20, 45);

  // Date
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`${new Date().toLocaleString()}`, 20, 52);

  // Table data
  const tableData = workloadData.map(tech => [
    tech.name,
    tech.open.toString(),
    tech.in_progress.toString(),
    tech.completed.toString(),
    tech.cancelled.toString(),
    tech.total.toString()
  ]);

  // Generate table
  autoTable(pdf, {
    head: [['Technician', 'Open', 'In Progress', 'Completed', 'Cancelled', 'Total']],
    body: tableData,
    startY: 60,
    styles: {
      fontSize: 9,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [52, 73, 94],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [244, 246, 247],
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 25 },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
      5: { cellWidth: 20 },
    },
  });

  return pdf;
};
