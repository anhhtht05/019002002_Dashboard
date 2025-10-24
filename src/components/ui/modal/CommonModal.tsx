import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CommonModalProps {
  title: string;
  show: boolean;
  message: string;
  onClose: () => void;
  onSave?: () => void;
  saveText?: string;
  closeText?: string;
}

const CommonModal: React.FC<CommonModalProps> = ({
  title,
  show,
  message,
  onClose,
  onSave,
  saveText = "Save",
  closeText = "Cancel",
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100000] flex justify-center bg-black/40 items-start "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* modal content */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-4 text-gray-700 dark:text-gray-200">
              {message}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
              >
                {closeText}
              </button>
              {onSave && (
                <button
                  onClick={onSave}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
                >
                  {saveText}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommonModal;
