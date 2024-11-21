// components/Modal.tsx

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  borderColor?: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, borderColor }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when the modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`participants bg-[#3D3A40] rounded-lg p-6 w-11/12 md:w-1/2 relative ${borderColor ? 'border border-t-0 border-b-0 border-r-4 border-l-0 ' : ''}`}
        style={borderColor ? { borderColor, borderStyle: 'solid' } : {}}

      >
        <button
          className="absolute top-2 right-5 text-white text-2xl font-bold hover:text-gray-400 focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <h2 id="modal-title" className="text-lg font-semibold text-white mb-4">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
