import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '../data';

interface ExportStatementParams {
  student: {
    name: string;
    id: string;
    program?: string;
    department?: string;
  };
  totalDebit: number;
  totalCredit: number;
  currentDues: number;
  transactions: Transaction[];
}

export function exportStatementToPdf({
  student,
  totalDebit,
  totalCredit,
  currentDues,
  transactions,
}: ExportStatementParams): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const todayStr = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  // 1. Institutional University Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(140, 21, 21); // #8c1515 University Crimson
  doc.text('PRESIDENCY UNIVERSITY', pageWidth / 2, 16, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(40, 40, 40);
  doc.text('STATEMENT OF ACCOUNT', pageWidth / 2, 22, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Official Academic & Financial Statement • Generated: ${todayStr}`, pageWidth / 2, 27, { align: 'center' });

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(14, 30, pageWidth - 14, 30);

  // 2. Student Info & Financial Summary Box
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(14, 34, pageWidth - 28, 26, 2, 2, 'FD');

  // Left side: Student metadata
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('Student Name:', 18, 41);
  doc.setFont('helvetica', 'normal');
  doc.text(student.name || 'N/A', 44, 41);

  doc.setFont('helvetica', 'bold');
  doc.text('Student ID:', 18, 47);
  doc.setFont('helvetica', 'normal');
  doc.text(student.id || 'N/A', 44, 47);

  doc.setFont('helvetica', 'bold');
  doc.text('Program:', 18, 53);
  doc.setFont('helvetica', 'normal');
  const progText = student.program || student.department || 'Undergraduate Degree';
  doc.text(progText.length > 35 ? progText.substring(0, 35) + '...' : progText, 44, 53);

  // Right side: Financial Totals
  const rightColX = pageWidth / 2 + 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Total Billed:', rightColX, 41);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tk ${totalDebit.toLocaleString()}`, rightColX + 32, 41);

  doc.setFont('helvetica', 'bold');
  doc.text('Total Paid:', rightColX, 47);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 128, 64); // emerald green
  doc.text(`Tk ${totalCredit.toLocaleString()}`, rightColX + 32, 47);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('Current Dues:', rightColX, 53);
  doc.setFont('helvetica', 'bold');
  if (currentDues > 0) {
    doc.setTextColor(190, 20, 20);
    doc.text(`Tk ${currentDues.toLocaleString()} (Due)`, rightColX + 32, 53);
  } else if (currentDues < 0) {
    doc.setTextColor(16, 128, 64);
    doc.text(`Tk ${Math.abs(currentDues).toLocaleString()} (Advance)`, rightColX + 32, 53);
  } else {
    doc.setTextColor(16, 128, 64);
    doc.text('Tk 0.00 (Clear)', rightColX + 32, 53);
  }

  // 3. Transactions Table
  const tableData = transactions.map((t) => [
    t.date || '-',
    t.description || '-',
    t.code || '-',
    t.id || '-',
    t.debit ? t.debit.toLocaleString() : '-',
    t.credit ? t.credit.toLocaleString() : '-',
    t.balance ? t.balance.toLocaleString() : '0',
  ]);

  // Grand total row
  const lastBalance = transactions.length > 0 ? transactions[transactions.length - 1].balance : 0;
  const grandTotalRow = [
    { content: 'Grand Total', colSpan: 4, styles: { halign: 'right' as const, fontStyle: 'bold' as const } },
    { content: totalDebit.toLocaleString(), styles: { halign: 'right' as const, fontStyle: 'bold' as const } },
    { content: totalCredit.toLocaleString(), styles: { halign: 'right' as const, fontStyle: 'bold' as const, textColor: [16, 128, 64] as [number, number, number] } },
    { content: lastBalance.toLocaleString(), styles: { halign: 'right' as const, fontStyle: 'bold' as const } },
  ];

  autoTable(doc, {
    startY: 65,
    margin: { left: 14, right: 14, top: 14, bottom: 20 },
    head: [['Date', 'Description', 'Item', 'Voucher', 'Debit (Tk)', 'Credit (Tk)', 'Balance (Tk)']],
    body: [...tableData, grandTotalRow],
    theme: 'grid',
    headStyles: {
      fillColor: [140, 21, 21], // #8c1515 University Crimson
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 22, halign: 'left' },
      1: { cellWidth: 'auto', halign: 'left' },
      2: { cellWidth: 20, halign: 'left' },
      3: { cellWidth: 22, halign: 'left' },
      4: { cellWidth: 24, halign: 'right' },
      5: { cellWidth: 24, halign: 'right' },
      6: { cellWidth: 24, halign: 'right' },
    },
    styles: {
      font: 'helvetica',
      fontSize: 7.5,
      cellPadding: 2,
      overflow: 'linebreak',
      lineColor: [220, 220, 220],
      lineWidth: 0.2,
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248],
    },
    didDrawPage: (data) => {
      // Footer on each page
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(7);
      doc.setTextColor(130, 130, 130);
      doc.setFont('helvetica', 'normal');
      const footerY = doc.internal.pageSize.getHeight() - 8;
      doc.text(
        'This document is a computer-generated statement and does not require an official signature. Presidency University SIMS.',
        14,
        footerY
      );
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageWidth - 14,
        footerY,
        { align: 'right' }
      );
    },
  });

  const sanitizedId = (student.id || 'Student').replace(/[^a-zA-Z0-9]/g, '_');
  const dateStamp = new Date().toISOString().slice(0, 10);
  doc.save(`Presidency_Statement_${sanitizedId}_${dateStamp}.pdf`);
}
