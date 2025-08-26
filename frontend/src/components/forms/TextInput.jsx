import React from 'react';

const TextInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputId = `input-${name}`;
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
      
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        className={`
          w-full px-3 py-2 border rounded-md text-sm 
          focus:ring-2 focus:ring-[#007C99] focus:outline-none
          transition-colors duration-200
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
  );
};

export default TextInput;
