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
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className, variant = 'default', onClick }) => {
  const variants = {
    default: 'bg-white rounded-2xl shadow-premium border border-slate-100/60 hover:shadow-premium-lg',
    elevated: 'bg-white rounded-2xl shadow-premium-lg border border-slate-100/40',
    outlined: 'bg-white rounded-2xl border-2 border-slate-200/80 hover:border-gold/30',
    glass: 'glass-card rounded-2xl shadow-premium',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        variants[variant],
        'transition-all duration-300',
        onClick && 'cursor-pointer active:scale-[0.99]',
        className
      )}
    >
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
    primary: 'bg-navy text-white hover:bg-navy-light shadow-navy hover:shadow-lg',
    secondary: 'bg-slate-100 text-navy hover:bg-slate-200 border border-slate-200/60',
    accent: 'gradient-gold text-navy-dark font-extrabold shadow-gold hover:shadow-lg hover:brightness-105',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
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
        'px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 transform active:scale-[0.97] inline-flex items-center justify-center gap-2',
        variants[variant],
        disabled && 'opacity-40 cursor-not-allowed pointer-events-none saturate-0',
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
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 ring-1 ring-emerald-100',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200/60 ring-1 ring-amber-100',
    error: 'bg-red-50 text-red-700 border border-red-200/60 ring-1 ring-red-100',
    info: 'bg-blue-50 text-blue-700 border border-blue-200/60 ring-1 ring-blue-100',
    default: 'bg-slate-50 text-slate-600 border border-slate-200/60 ring-1 ring-slate-100',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  return (
    <span className={cn(
      'rounded-full font-semibold inline-flex items-center gap-1 whitespace-nowrap',
      variants[variant],
      sizes[size]
    )}>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        variant === 'success' && 'bg-emerald-500',
        variant === 'warning' && 'bg-amber-500',
        variant === 'error' && 'bg-red-500',
        variant === 'info' && 'bg-blue-500',
        variant === 'default' && 'bg-slate-400',
      )} />
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
  icon?: React.ReactNode;
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
  icon,
}) => {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] ml-0.5 flex items-center gap-1">
          {label}
          {required && <span className="text-gold text-xs">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            'w-full py-3 bg-white border-2 rounded-xl outline-none transition-all duration-300 font-bold text-navy text-sm',
            icon ? 'pl-11 pr-4' : 'px-4',
            'placeholder:text-slate-500 placeholder:font-bold',
            'hover:border-slate-400',
            error
              ? 'border-red-500 focus:border-red-600 focus:ring-4 focus:ring-red-100'
              : 'border-slate-300 focus:border-gold focus:ring-4 focus:ring-gold/15',
            disabled && 'opacity-40 cursor-not-allowed bg-slate-100'
          )}
        />
      </div>
      {error && <p className="text-red-500 text-[10px] font-semibold ml-0.5">{error}</p>}
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
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] ml-0.5 flex items-center gap-1">
          {label}
          {required && <span className="text-gold text-xs">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={cn(
          'w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl outline-none transition-all duration-300 font-bold text-navy text-sm appearance-none',
          'hover:border-slate-400',
          'focus:border-gold focus:ring-4 focus:ring-gold/15',
          disabled && 'opacity-40 cursor-not-allowed'
        )}
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
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] ml-0.5 flex items-center gap-1">
          {label}
          {required && <span className="text-gold text-xs">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={cn(
          'w-full px-4 py-3 bg-white border-2 border-slate-300 rounded-xl outline-none transition-all duration-300 font-bold text-navy text-sm resize-none',
          'placeholder:text-slate-500 placeholder:font-bold',
          'hover:border-slate-400',
          'focus:border-gold focus:ring-4 focus:ring-gold/15'
        )}
      />
    </div>
  );
};
