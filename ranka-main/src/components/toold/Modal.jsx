import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isModalOpen, closeModal, children, customClass }) => {
  const modalRef = useRef();

  // Close modal on "Escape" key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeModal]);

  // Prevent body scroll when the modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Focus Management
  useEffect(() => {
    if (isModalOpen) {
      const firstFocusableElement = modalRef.current.querySelector('[data-focus-first]');
      firstFocusableElement?.focus();
    }
  }, [isModalOpen]);

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ba"
        >
          {/* Backdrop with blur effect */}
          <motion.div
            initial={{ backdropFilter: "blur(0px)" }}
            animate={{ backdropFilter: "blur(5px)" }}
            exit={{ backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black bg-opacity-30"
            onClick={closeModal} // Close modal when clicking the backdrop
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`relative bg-white rounded-xl w-full max-w-5xl mx-4 p-8 shadow-2xl overflow-y-auto ${customClass}`}
            style={{ maxHeight: "90vh" }} // Ensures the modal takes up at most 90% of the viewport height
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              onClick={closeModal}
              aria-label="Close Modal"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Content */}
            <div id="modal-title" className="text-gray-800" data-focus-first>
              {children}
            </div>
           
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default Modal;