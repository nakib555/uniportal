interface Exam {
  courseCode: string;
  title: string;
  section: string;
  type: string;
  day: string;
  date: string;
  time: string;
  room: string;
  campus: string;
  faculty: string;
  semester?: string;
}

// Convert month name to index (0-11)
const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

function parseSingleDateTime(dateStr: string, timeStrPart: string): Date | null {
  try {
    const cleanDate = dateStr.replace(/,/g, ' ').replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
    const parts = cleanDate.split(' ');
    
    let day = 1;
    let monthIdx = 8; // Default to Sep
    let year = 2026;

    for (const part of parts) {
      const lower = part.toLowerCase();
      const mIdx = Object.keys(MONTHS).findIndex(m => lower.startsWith(m));
      if (mIdx !== -1) {
        monthIdx = mIdx;
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num)) {
          if (num > 31) {
            year = num < 100 ? 2000 + num : num;
          } else if (num > 0) {
            if (day === 1 && parts.indexOf(part) === 0) {
              day = num;
            } else if (parts.indexOf(part) === parts.length - 1) {
              year = num < 100 ? 2000 + num : num;
            } else {
              day = num;
            }
          }
        }
      }
    }

    let hours = 9;
    let minutes = 0;
    const cleanTime = timeStrPart.trim().toLowerCase();
    const ampm = cleanTime.includes('pm') ? 'pm' : 'am';
    const timeNumStr = cleanTime.replace(/[apm\s]/g, '');
    const [hStr, mStr] = timeNumStr.split(':');
    let parsedH = parseInt(hStr, 10);
    const parsedM = parseInt(mStr, 10);
    
    if (!isNaN(parsedH)) {
      if (ampm === 'pm' && parsedH < 12) parsedH += 12;
      if (ampm === 'am' && parsedH === 12) parsedH = 0;
      hours = parsedH;
    }
    if (!isNaN(parsedM)) {
      minutes = parsedM;
    }

    return new Date(year, monthIdx, day, hours, minutes, 0);
  } catch (err) {
    console.error("Error parsing date or time component:", dateStr, timeStrPart, err);
    return null;
  }
}

function formatICSDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}${m}${d}T${h}${min}${s}`;
}

export function exportExamsToICS(exams: Exam[], semesterName: string = 'Summer 2026') {
  let icsLines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Presidency University student Portal//Exam Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  exams.forEach((ex) => {
    const timeParts = ex.time.split('-');
    const startStr = timeParts[0] || '09:00 am';
    const endStr = timeParts[1] || '11:00 am';

    let startDate = parseSingleDateTime(ex.date, startStr);
    let endDate = parseSingleDateTime(ex.date, endStr);

    if (!startDate) {
      // Create a default if parsing failed
      startDate = new Date();
    }
    if (!endDate) {
      endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default to 2 hours
    }

    const uid = `pu-exam-${ex.courseCode}-${ex.section}-${startDate.getTime()}@presidency.edu.bd`;
    const dtStamp = formatICSDate(new Date());
    const dtStart = formatICSDate(startDate);
    const dtEnd = formatICSDate(endDate);

    const summary = `Exam: ${ex.courseCode} - ${ex.title} (Sec ${ex.section})`;
    const description = `Type: ${ex.type}\\nSection: ${ex.section}\\nFaculty: ${ex.faculty || 'N/A'}\\nSemester: ${ex.semester || semesterName}\\n\\nGenerated via Presidency University Portal.`;
    const location = `Room ${ex.room}, ${ex.campus} Campus, Presidency University`;

    icsLines.push(
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      'END:VEVENT'
    );
  });

  icsLines.push('END:VCALENDAR');

  const icsString = icsLines.join('\r\n');
  const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Exam_Schedule_${semesterName.replace(/\s+/g, '_')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
