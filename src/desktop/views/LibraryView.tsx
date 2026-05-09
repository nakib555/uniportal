import React from 'react';
import { Card, Badge } from '../components/ui';
import { BookMarked, Search, Clock } from 'lucide-react';

export function LibraryView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <h2 className="text-2xl font-bold">Library Management</h2>
         <div className="relative w-full md:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input placeholder="Search catalog..." className="pl-9 pr-4 py-2 border rounded-full text-sm bg-stone-50 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-[#8c1515]" />
         </div>
      </div>
      
      <h3 className="font-bold text-lg mt-8">Currently Borrowed</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         <Card className="p-4 flex gap-4 items-center cursor-pointer hover:shadow-md transition-all group border-transparent hover:border-indigo-100">
            <div className="w-16 h-20 bg-indigo-100 rounded flex items-center justify-center group-hover:scale-105 transition-transform">
               <BookMarked className="w-8 h-8 text-indigo-500" />
            </div>
            <div className="flex-1">
               <h4 className="font-bold group-hover:text-indigo-600 transition-colors">Introduction to Algorithms</h4>
               <p className="text-sm text-stone-500">Thomas H. Cormen</p>
               <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-600">Due in 3 days</span>
               </div>
            </div>
            <button className="px-3 py-1.5 border rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">Renew</button>
         </Card>
      </div>

      <h3 className="font-bold text-lg mt-8 mb-4">Catalog Results</h3>
      <div className="grid grid-cols-1 gap-4">
         {[1,2,3].map(i => (
             <div key={i} className="p-4 flex gap-4 items-center border rounded-lg hover:shadow-sm transition-all cursor-pointer group hover:-translate-y-0.5 hover:border-stone-300 dark:hover:border-stone-600 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                <div className="w-16 h-20 bg-stone-100 dark:bg-stone-800 rounded flex items-center justify-center group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors">
                   <BookMarked className="w-8 h-8 text-stone-300 dark:text-stone-500 group-hover:text-stone-400 group-hover:scale-105 transition-all" />
                </div>
                <div className="flex-1">
                   <h4 className="font-bold group-hover:text-[#8c1515] dark:group-hover:text-[#ef4444] transition-colors">{i === 1 ? 'Artificial Intelligence: A Modern Approach' : i === 2 ? 'Introduction to the Theory of Computation' : 'Clean Code'}</h4>
                   <p className="text-sm text-stone-500 dark:text-stone-400">{i === 1 ? 'Stuart Russell' : i === 2 ? 'Michael Sipser' : 'Robert C. Martin'}</p>
                   <Badge variant="outline" className="mt-2 text-xs opacity-75 group-hover:opacity-100 transition-opacity">Available</Badge>
                </div>
                <button className="px-3 py-1.5 border border-stone-200 dark:border-stone-700 rounded-lg text-sm font-medium hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors pointer-events-none group-hover:border-stone-300 dark:group-hover:border-stone-600">Place Hold</button>
             </div>
         ))}
      </div>
    </div>
  );
}
