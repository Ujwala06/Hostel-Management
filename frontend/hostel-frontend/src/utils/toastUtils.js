import toast from 'react-hot-toast';

/**
 * Toast utility functions for consistent notifications
 */

export const showSuccess = (message, duration = 3000) => {
  toast.success(message, { duration });
};

export const showError = (message, duration = 4000) => {
  toast.error(message, { duration });
};

export const showLoading = (message = 'Loading...') => {
  return toast.loading(message);
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export const showCustom = (message, icon, duration = 4000) => {
  toast.custom((t) => (
    <div
      className="bg-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3"
      style={{
        opacity: t.visible ? 1 : 0,
        transition: 'opacity 0.3s',
      }}
    >
      <span>{icon}</span>
      <span className="text-gray-800">{message}</span>
    </div>
  ), { duration });
};

/**
 * Promise-based toast for async operations
 * 
 * Usage:
 * toastPromise(
 *   apiCall(),
 *   {
 *     loading: 'Submitting...',
 *     success: 'Submitted successfully!',
 *     error: 'Failed to submit'
 *   }
 * );
 */
export const toastPromise = (promise, messages) => {
  return toast.promise(
    promise,
    {
      loading: messages.loading || 'Processing...',
      success: messages.success || 'Success!',
      error: messages.error || 'Something went wrong',
    }
  );
};
