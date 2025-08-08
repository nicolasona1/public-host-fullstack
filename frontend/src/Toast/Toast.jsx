import React, { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto hide after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const icon = type === 'success' ? <CheckCircle className="toast-icon" /> : <XCircle className="toast-icon" />;
  const className = `toast toast-${type}`;

  return (
    <div className={className}>
      <div className="toast-content">
        {icon}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <X className="toast-close-icon" />
      </button>
    </div>
  );
};

export default Toast; 