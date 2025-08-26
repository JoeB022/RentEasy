import React from 'react';

const TextArea = ({
  label,
  name,
  placeholder,
  error,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  className = '',
  ...props
}) => {
  const inputId = `textarea-${name}`;
  const errorId = `error-${name}`;

  return (
    <div className="space-y-1">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        id={inputId}
        name={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        maxLength={maxLength}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        className={`
          w-full px-3 py-2 border rounded-md text-sm 
          focus:ring-2 focus:ring-[#007C99] focus:outline-none
          transition-colors duration-200 resize-vertical
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
            : 'border-gray-300 focus:border-[#007C99]'
          }
          ${disabled 
            ? 'bg-gray-50 text-gray-500 cursor-not-allowed' 
            : 'bg-white text-gray-900'
          }
          ${className}
        `}
        {...props}
      />
      
      {/* Character count and error display */}
      <div className="flex justify-between items-center">
        {maxLength && (
          <span className="text-xs text-gray-500">
            {props.value?.length || 0} / {maxLength} characters
          </span>
        )}
        {error && (
          <p 
            id={errorId}
            className="text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default TextArea;
