import { Toaster } from 'react-hot-toast';

function Toast() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        style: {
          background: '#1f2937',      // gray-800
          color: '#fff',
          border: '1px solid #374151', // gray-700
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        },
        // Success toast specific options
        success: {
          duration: 3000,
          icon: '✅',
          style: {
            background: '#065f46',      // green-800
            border: '1px solid #10b981', // green-500
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        // Error toast specific options
        error: {
          duration: 4000,
          icon: '❌',
          style: {
            background: '#7f1d1d',      // red-800
            border: '1px solid #ef4444', // red-500
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
        // Loading toast specific options
        loading: {
          duration: Infinity,
          icon: '🔄',
          style: {
            background: '#1e3a8a',      // blue-800
            border: '1px solid #3b82f6', // blue-500
          },
        },
      }}
    />
  );
}

export default Toast;