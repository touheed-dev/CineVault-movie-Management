import React, { useEffect } from 'react';

/**
 * Toast Notification Component
 * Shows success and error toast messages that auto-dismiss.
 */
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <aside className="toast-container" aria-live="assertive">
      <div className={`toast-card toast-${toast.type || 'info'}`}>
        <div className="toast-icon">
          {isSuccess ? '✅' : '❌'}
        </div>
        <div className="toast-body">
          <p className="toast-title">{isSuccess ? 'Success' : 'Error'}</p>
          <p className="toast-message">{toast.message}</p>
        </div>
        <button
          type="button"
          className="toast-close-btn"
          onClick={onClose}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </aside>
  );
}

export default Toast;
