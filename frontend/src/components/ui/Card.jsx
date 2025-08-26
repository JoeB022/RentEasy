import React from 'react';

const Card = ({
  children,
  variant = 'default',
  padding = 'default',
  shadow = 'default',
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-xl border border-secondary-200 transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white',
    elevated: 'bg-white shadow-soft hover:shadow-medium',
    outlined: 'bg-white border-2 border-secondary-200',
    filled: 'bg-secondary-50 border-secondary-200',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const shadowClasses = {
    none: '',
    soft: 'shadow-soft',
    medium: 'shadow-medium',
    large: 'shadow-large',
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// Card sub-components for better organization
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Body = ({ children, className = '', ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`mt-6 pt-4 border-t border-secondary-200 ${className}`} {...props}>
    {children}
  </div>
);

export default Card;
