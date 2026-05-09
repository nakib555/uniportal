import React from 'react';

export const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode, variant?: "default" | "success" | "danger" | "warning" | "outline" | "brand", className?: string }> = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
    danger: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50",
    warning: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    outline: "bg-transparent border border-stone-200 text-stone-600 dark:border-stone-700 dark:text-stone-400",
    brand: "bg-[#8c1515]/10 text-[#8c1515] border border-[#8c1515]/20 dark:bg-[#8c1515]/20 dark:text-[#ef4444] dark:border-[#8c1515]/40"
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};
