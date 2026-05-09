import React from 'react';
import { Card, Badge } from '../components/ui';
import { FileText, CheckCircle2 } from 'lucide-react';

export function FinancialAidView() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Financial Aid & Scholarships</h2>
      <Card className="p-6 bg-stone-50 border-emerald-200">
         <div className="flex justify-between items-start">
            <div>
               <Badge variant="success" className="mb-2">Active</Badge>
               <h3 className="text-xl font-bold">Merit Scholarship (Dean's List)</h3>
               <p className="text-stone-600 mt-1">Based on maintaining a CGPA above 3.80</p>
            </div>
            <div className="text-right">
               <div className="text-sm text-stone-500 uppercase font-bold">Waiver Percentage</div>
               <div className="text-3xl font-black text-emerald-600">50%</div>
            </div>
         </div>
         <div className="mt-6 flex items-center gap-2 text-sm font-medium text-emerald-600">
            <CheckCircle2 className="w-5 h-5" /> Applied automatically to your tuition fees
         </div>
      </Card>

      <h3 className="font-bold text-lg mt-8">Available Applications</h3>
      <Card className="p-0 overflow-hidden shadow-sm">
         <div className="divide-y relative">
            <div className="p-4 flex justify-between items-center hover:bg-stone-50 cursor-pointer transition-colors group">
               <div>
                  <h4 className="font-bold group-hover:text-amber-600 transition-colors">Need-Based Financial Aid</h4>
                  <p className="text-sm text-stone-500">Requires tax documents and income statements.</p>
               </div>
               <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-colors pointer-events-none">Apply Now</button>
            </div>
            <div className="p-4 flex justify-between items-center hover:bg-stone-50 cursor-pointer transition-colors group">
               <div>
                  <h4 className="font-bold group-hover:text-emerald-600 transition-colors">Sibling Discount</h4>
                  <p className="text-sm text-stone-500">For students who have a currently enrolled sibling.</p>
               </div>
               <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors pointer-events-none">Apply Now</button>
            </div>
         </div>
      </Card>
    </div>
  );
}
