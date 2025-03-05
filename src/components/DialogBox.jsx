import React from "react";

const DialogBox = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="absolute  bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-900 hover:text-gray-900"
        >
          ✕
        </button>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
};

export default DialogBox;
