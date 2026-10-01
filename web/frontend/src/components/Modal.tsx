import React from 'react';
import ReactModal from 'react-modal';

if (typeof document !== 'undefined') {
  ReactModal.setAppElement('#root');
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}: ModalProps) {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`bg-karp-background rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}
      overlayClassName="fixed inset-0 bg-karp-font/50 flex items-center justify-center z-50 p-4"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      preventScroll={true}
      style={{
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(29, 15, 72, 0.5)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        content: {
          position: 'relative',
          top: 'auto',
          left: 'auto',
          right: 'auto',
          bottom: 'auto',
          transform: 'none',
          border: 'none',
          borderRadius: '12px',
          padding: 0,
          margin: 0,
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
          backgroundColor: '#fffdfa',
        },
      }}
    >
      <div className="flex flex-col h-full min-h-0 bg-karp-background">
        <div className="sticky top-0 bg-karp-background border-b border-karp-font/20 px-6 py-4 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-karp-font">{title}</h2>
            <button
              onClick={onClose}
              className="text-karp-font/60 hover:text-karp-font transition-colors p-1"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-karp-background">
          {children}
        </div>
      </div>
    </ReactModal>
  );
}
