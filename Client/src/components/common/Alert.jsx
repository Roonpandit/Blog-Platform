// Alert.jsx
import React, { useState, useEffect } from 'react';
import './Alert.css';

const Alert = ({ type = 'info', message, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  const alertIcon = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`alert alert-${type}`}>
      <div className="alert-icon">{alertIcon[type]}</div>
      <div className="alert-message">{message}</div>
      <button className="alert-close" onClick={handleClose}>×</button>
    </div>
  );
};

export default Alert;