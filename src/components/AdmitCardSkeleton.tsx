import React from 'react';
import { Card } from './ui/card';

export function AdmitCardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Skeleton Slip Card matching exact official dimensions */}
      <Card className="p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl max-w-3xl mx-auto shadow-sm">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="h-12 w-12 bg-stone-200 dark:bg-stone-800 rounded-lg flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-4 w-44 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-3 w-56 bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
          </div>
          <div className="h-6 w-24 bg-stone-200 dark:bg-stone-800 rounded-full" />
        </div>

        {/* Student Meta Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6 border-b border-stone-100 dark:border-stone-800/50">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-stone-50 dark:border-stone-800/30 pb-2">
              <div className="h-3 w-24 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-3 w-36 bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
            <div className="flex justify-between items-center border-b border-stone-50 dark:border-stone-800/30 pb-2">
              <div className="h-3 w-20 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-3 w-28 bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
            <div className="flex justify-between items-center border-b border-stone-50 dark:border-stone-800/30 pb-2">
              <div className="h-3 w-16 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-3 w-24 bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-stone-50 dark:border-stone-800/30 pb-2">
              <div className="h-3 w-20 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-3 w-40 bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
            <div className="flex justify-between items-center border-b border-stone-50 dark:border-stone-800/30 pb-2">
              <div className="h-3 w-28 bg-stone-200 dark:bg-stone-800 rounded" />
              <div className="h-3 w-24 bg-stone-200 dark:bg-stone-800 rounded" />
            </div>
          </div>
        </div>

        {/* Exam Schedule Table Skeleton */}
        <div className="py-6 space-y-4">
          <div className="h-4 w-32 bg-stone-200 dark:bg-stone-800 rounded" />
          <div className="rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
            <div className="bg-stone-50 dark:bg-stone-850 p-4 border-b border-stone-200 dark:border-stone-800 flex justify-between gap-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-16" />
              ))}
            </div>
            <div className="divide-y divide-stone-100 dark:divide-stone-800/50">
              {[1, 2, 3].map((row) => (
                <div key={row} className="p-4 flex justify-between items-center gap-2">
                  <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-20" />
                  <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-10" />
                  <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-16" />
                  <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-20" />
                  <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-12" />
                  <div className="h-4 bg-stone-200 dark:bg-stone-800 rounded w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Skeleton */}
        <div className="pt-6 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center">
          <div className="space-y-1">
            <div className="h-3 w-28 bg-stone-200 dark:bg-stone-800 rounded" />
            <div className="h-2.5 w-36 bg-stone-200 dark:bg-stone-800 rounded" />
          </div>
          <div className="space-y-2 flex flex-col items-end">
            <div className="h-8 w-28 bg-stone-200 dark:bg-stone-800 rounded" />
            <div className="h-3 w-32 bg-stone-200 dark:bg-stone-800 rounded" />
          </div>
        </div>
      </Card>
    </div>
  );
}
