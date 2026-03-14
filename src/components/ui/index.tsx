import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Card ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, variant = 'default', onClick }) => {
  const variants = {
    default: 'bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100/50',
    elevated: 'bg-white rounded-xl shadow-xl border border-slate-100/50',
    outlined: 'bg-white rounded-xl border-2 border-slate-200',
  };

  return (
    <div onClick={onClick} className={cn(variants[variant], onClick && 'cursor-pointer', className)}>
      {children}
    </div>
  );
};

// --- Button ---
interface ButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'success' | 'ghost' | 'outline';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  style?: React.CSSProperties;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  disabled = false,
  style,
}) => {
  const variants = {
    primary: 'bg-navy text-white hover:bg-navy-dark shadow-md',
    secondary: 'bg-slate-100 text-navy hover:bg-slate-200',
    accent: 'bg-gold text-white hover:bg-gold-dark shadow-md shadow-gold/20',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    ghost: 'bg-transparent text-navy hover:bg-slate-100',
    outline: 'bg-transparent border-2 border-slate-200 text-slate-500 hover:border-navy hover:text-navy',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={cn(
        'px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-300 transform active:scale-95',
        variants[variant],
        disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className
      )}
    >
      {children}
    </button>
  );
};

// --- Badge ---
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'md' }) => {
  const variants = {
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-slate-100 text-slate-800',
  };

  const sizes = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={cn('rounded-full font-semibold inline-flex items-center', variants[variant], sizes[size])}>
      {children}
    </span>
  );
};

// --- Input ---
interface InputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required,
  disabled,
  className,
  error,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={cn(
          'w-full p-3 bg-slate-50 border-2 rounded-xl outline-none transition-all font-medium text-navy text-sm',
          error ? 'border-red-300 focus:border-red-500' : 'border-slate-100 focus:border-gold',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      />
      {error && <p className="text-red-500 text-[10px] font-bold ml-1">{error}</p>}
    </div>
  );
};

// --- Select ---
interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  required,
  disabled,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-gold transition-all font-medium text-navy text-sm"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// --- Textarea ---
interface TextareaProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  rows?: number;
  className?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  required,
  rows = 4,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className="w-full p-3 bg-slate-50 border-2 border-slate-100 rounded-xl outline-none focus:border-gold transition-all font-medium text-navy text-sm resize-none"
      />
    </div>
  );
};
