import React from 'react';
import { useAppStore } from '../store';
import { ClassSchedule } from '../data';
import { formatTime } from '../lib/utils';

interface ScheduleTableProps {
  schedule: ClassSchedule[];
}

export function ScheduleTable({ schedule }: ScheduleTableProps) {
  const { is24HourFormat } = useAppStore();

  return (
    <div className="overflow-x-auto w-full border border-stone-200 dark:border-stone-800 rounded-lg">
      <table className="w-full text-sm text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
            <th className="px-5 py-3 font-bold border-b border-stone-200 dark:border-stone-700 whitespace-nowrap">Course</th>
            <th className="px-5 py-3 font-bold border-b border-stone-200 dark:border-stone-700 whitespace-nowrap text-center">Section</th>
            <th className="px-5 py-3 font-bold border-b border-stone-200 dark:border-stone-700 whitespace-nowrap">Day</th>
            <th className="px-5 py-3 font-bold border-b border-stone-200 dark:border-stone-700 whitespace-nowrap">Start</th>
            <th className="px-5 py-3 font-bold border-b border-stone-200 dark:border-stone-700 whitespace-nowrap">End</th>
            <th className="px-5 py-3 font-bold border-b border-stone-200 dark:border-stone-700 whitespace-nowrap">Room</th>
            <th className="px-5 py-3 font-bold border-b border-stone-200 dark:border-stone-700 whitespace-nowrap">Campus</th>
            <th className="px-5 py-3 font-bold border-b border-stone-200 dark:border-stone-700 whitespace-nowrap">Faculty</th>
            <th className="px-5 py-3 font-bold border-b border-stone-200 dark:border-stone-700 whitespace-nowrap">Semester</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
          {schedule.map((row, idx) => (
            <tr key={idx} className={`${row.courseCode === '-' ? 'bg-stone-50 dark:bg-stone-800/20 text-stone-500' : 'bg-white dark:bg-stone-900'} hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors`}>
              <td className={`px-5 py-3 ${row.courseCode !== '-' ? 'text-amber-700 dark:text-amber-500 font-bold' : ''}`}>{row.courseCode}</td>
              <td className={`px-5 py-3 ${row.courseCode !== '-' ? 'text-amber-700 dark:text-amber-500 font-bold' : ''} text-center`}>{row.section || "-"}</td>
              <td className="px-5 py-3 text-stone-900 dark:text-stone-100 font-medium whitespace-nowrap">{row.day}</td>
              <td className="px-5 py-3 tabular-nums whitespace-nowrap">{row.start === '-' ? '-' : formatTime(row.start, is24HourFormat)}</td>
              <td className="px-5 py-3 tabular-nums whitespace-nowrap">{row.end === '-' ? '-' : formatTime(row.end, is24HourFormat)}</td>
              <td className="px-5 py-3 whitespace-nowrap">{row.room || "-"}</td>
              <td className="px-5 py-3">{row.campus || "Gulshan"}</td>
              <td className="px-5 py-3 whitespace-nowrap">{row.faculty || "-"}</td>
              <td className="px-5 py-3 whitespace-nowrap">{row.semester || ""}</td>
            </tr>
          ))}
          {schedule.length === 0 && (
             <tr>
               <td colSpan={9} className="px-5 py-8 text-center text-stone-500 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-700">No classes found</td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
