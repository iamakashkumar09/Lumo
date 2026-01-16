import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-300">{label}</label>
      <input
        ref={ref}
        className={`w-full bg-white dark:bg-neutral-900 border ${error ? 'border-red-500' : 'border-neutral-200 dark:border-neutral-800'} rounded-xl py-3 px-4 outline-none dark:text-white focus:ring-2 focus:ring-purple-500/20 transition-all ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;