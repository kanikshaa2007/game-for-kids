'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'lg',
  children,
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'font-bold rounded-2xl transition-all duration-200 flex items-center justify-center gap-2';

  const variantStyles = {
    primary: 'bg-primary hover:bg-primary-light text-white shadow-button hover:shadow-button-hover',
    secondary: 'bg-secondary hover:bg-secondary-light text-white shadow-button hover:shadow-button-hover',
    accent: 'bg-accent hover:bg-accent-light text-gray-800 shadow-button hover:shadow-button-hover',
    success: 'bg-success hover:bg-success-light text-white shadow-button hover:shadow-button-hover',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-button hover:shadow-button-hover',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };

  const sizeStyles = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
    xl: 'py-5 px-10 text-xl',
  };

  return (
    <motion.button
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'transform hover:scale-105'}
        ${className}
      `}
      disabled={disabled || isLoading}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
