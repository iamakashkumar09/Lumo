import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'glass';
}

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const variants = {
    primary: 'bg-neutral-900 dark:bg-white text-white dark:text-black hover:scale-105 shadow-lg shadow-neutral-500/20',
    ghost: 'hover:bg-white/50 dark:hover:bg-neutral-800/50 text-neutral-900 dark:text-white',
    glass: 'bg-white/30 dark:bg-black/30 backdrop-blur-md border border-white/20 text-neutral-900 dark:text-white hover:bg-white/40'
  };
  
  return (
    <button 
      className={`px-5 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-300 active:scale-95 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}