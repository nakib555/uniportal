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

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded-xl';
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };
  const variants = {
    primary: 'bg-[#8c1515] hover:bg-[#701010] text-white shadow-sm',
    secondary: 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200',
    outline: 'border border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300',
    ghost: 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
