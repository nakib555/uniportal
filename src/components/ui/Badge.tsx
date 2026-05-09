import React from 'react';
import clsx from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger" | "warning" | "outline" | "brand";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
    danger: "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/50",
    warning: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    outline: "border border-stone-200 text-stone-600 dark:border-stone-700 dark:text-stone-400 bg-transparent",
    brand: "bg-[#8c1515] text-white dark:bg-[#ef4444]"
  };
  
  return (
    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold transition-colors", variants[variant], className)}>
      {children}
    </span>
  );
};
