import React from 'react';
import { Card, Badge } from '../components/ui';
import { COMPLETED_COURSES } from '../../data';
import { Download, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function GradesView() {
  const handleDownloadTranscriptPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("University Portal", 105, 20, { align: "center" });
    
    doc.setFontSize(14);
    doc.text("Academic Transcript", 105, 30, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 38, { align: "center" });

    doc.setLineWidth(0.5);
    doc.line(14, 42, 196, 42); // Horizontal line

    // Summary Info
    doc.setFont("helvetica", "bold");
    doc.text(`Cumulative GPA: 3.85`, 14, 52);
    doc.text(`Semester GPA (Fall 2025): 3.92`, 14, 58);

    // Table
    autoTable(doc, {
      startY: 70,
      head: [['Course Code', 'Course Title', 'Credits', 'Grade']],
      body: COMPLETED_COURSES.map(c => [
        c.code,
        c.title,
        c.credits.toString(),
        c.grade
      ]),
      styles: { fontSize: 9, cellPadding: 4 },
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [248, 248, 248] },
    });

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    }

    // Download the PDF
    doc.save('Academic_Transcript.pdf');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-stone-50 dark:bg-stone-900 p-6 rounded-xl border border-stone-200 dark:border-stone-800">
        <div>
           <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Academic Transcript</h2>
           <p className="text-stone-500 dark:text-stone-400">Cumulative GPA: <span className="font-bold text-stone-900 dark:text-stone-100">3.85</span></p>
        </div>
        <button onClick={handleDownloadTranscriptPDF} className="flex items-center gap-2 bg-[#8c1515] hover:bg-[#731010] dark:bg-[#ef4444] dark:hover:bg-[#dc2626] text-white px-4 py-2 rounded-xl font-bold transition-colors">
           <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <Card className="overflow-hidden border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
        <div className="p-4 bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex justify-between items-center">
           <h3 className="font-bold text-stone-900 dark:text-white">Fall 2025</h3>
           <Badge variant="success">Semester GPA: 3.92</Badge>
        </div>
        <div className="divide-y divide-stone-200 dark:divide-stone-800">
           {COMPLETED_COURSES.map(course => (
             <div key={course.code} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                   <div className="font-bold text-lg text-stone-900 dark:text-white">{course.code}</div>
                   <div className="text-sm text-stone-500 dark:text-stone-400">{course.title}</div>
                </div>
                <div className="flex gap-8 mt-4 md:mt-0 text-right">
                   <div>
                      <div className="text-xs text-stone-400 dark:text-stone-500 uppercase font-bold tracking-widest">Credits</div>
                      <div className="font-bold text-stone-900 dark:text-stone-100">{course.credits}</div>
                   </div>
                   <div>
                      <div className="text-xs text-stone-400 dark:text-stone-500 uppercase font-bold tracking-widest">Grade</div>
                      <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{course.grade}</div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </Card>
    </div>
  );
}
