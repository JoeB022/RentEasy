import React from 'react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'md',
  className = '',
  ...props
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative w-full ${sizeClasses[size]} bg-white rounded-xl shadow-large
            transform transition-all duration-200 ease-out
            ${className}
          `}
          {...props}
        >
          {/* Header */}
          {title && (
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-semibold text-secondary-900">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-secondary-400 hover:text-secondary-600 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Body */}
          <div className="p-6">
            {children}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50 rounded-b-xl">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
