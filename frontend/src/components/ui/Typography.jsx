import React from 'react';

const Typography = {
  // Heading component with different levels
  Heading: ({ 
    level = 1, 
    children, 
    className = '', 
    ...props 
  }) => {
    const Tag = `h${level}`;
    const sizeClasses = {
      1: 'text-4xl font-bold text-secondary-900',
      2: 'text-3xl font-bold text-secondary-900',
      3: 'text-2xl font-semibold text-secondary-900',
      4: 'text-xl font-semibold text-secondary-900',
      5: 'text-lg font-semibold text-secondary-900',
      6: 'text-base font-semibold text-secondary-900',
    };

    return (
      <Tag 
        className={`${sizeClasses[level]} ${className}`}
        {...props}
      >
        {children}
      </Tag>
    );
  },

  // Subheading component
  Subheading: ({ 
    children, 
    variant = 'default',
    className = '', 
    ...props 
  }) => {
    const variantClasses = {
      default: 'text-lg text-secondary-700',
      muted: 'text-base text-secondary-600',
      accent: 'text-base text-primary-600 font-medium',
    };

    return (
      <p 
        className={`${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  },

  // Body text component
  BodyText: ({ 
    children, 
    variant = 'default',
    size = 'base',
    className = '', 
    ...props 
  }) => {
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
    };

    const variantClasses = {
      default: 'text-secondary-700',
      muted: 'text-secondary-600',
      accent: 'text-primary-600',
      error: 'text-error-600',
      success: 'text-success-600',
    };

    return (
      <p 
        className={`${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  },

  // Caption component
  Caption: ({ 
    children, 
    variant = 'default',
    className = '', 
    ...props 
  }) => {
    const variantClasses = {
      default: 'text-sm text-secondary-500',
      muted: 'text-xs text-secondary-400',
      accent: 'text-sm text-primary-500',
      error: 'text-sm text-error-500',
      success: 'text-sm text-success-500',
    };

    return (
      <span 
        className={`${variantClasses[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  },

  // Label component
  Label: ({ 
    children, 
    required = false,
    className = '', 
    ...props 
  }) => {
    return (
      <label 
        className={`block text-sm font-medium text-secondary-700 ${className}`}
        {...props}
      >
        {children}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
    );
  },
};

export default Typography;
