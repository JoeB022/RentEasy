import React from 'react';

const Input = ({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  success,
  required = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const inputId = `input-${name}`;
  const errorId = `error-${name}`;
  const successId = `success-${name}`;

  const baseClasses = 'w-full px-4 py-3 border rounded-lg text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const stateClasses = {
    default: 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500',
    error: 'border-error-300 focus:border-error-500 focus:ring-error-500',
    success: 'border-success-300 focus:border-success-500 focus:ring-success-500',
  };

  const getStateClass = () => {
    if (error) return stateClasses.error;
    if (success) return stateClasses.success;
    return stateClasses.default;
  };

  const disabledClasses = disabled 
    ? 'bg-secondary-50 text-secondary-500 cursor-not-allowed' 
    : 'bg-white text-secondary-900';

  const widthClasses = fullWidth ? 'w-full' : '';

  return (
    <div className={`space-y-2 ${widthClasses}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-secondary-700"
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : success ? successId : undefined}
        className={`
          ${baseClasses}
          ${getStateClass()}
          ${disabledClasses}
          ${className}
        `}
        {...props}
      />
      
      {error && (
        <p 
          id={errorId}
          className="text-sm text-error-600"
          role="alert"
        >
          {error}
        </p>
      )}

      {success && (
        <p 
          id={successId}
          className="text-sm text-success-600"
          role="alert"
        >
          {success}
        </p>
      )}
    </div>
  );
};

export default Input;
