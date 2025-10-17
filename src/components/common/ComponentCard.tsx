import React, { useState } from "react";

interface ComponentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  modalComponent?: React.ComponentType<{ onClose: () => void }>;
  actionLabel?: string;
}

const ComponentCard: React.FC<ComponentCardProps> = ({
  title,
  children,
  modalComponent: ModalComponent,
  actionLabel = "",
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleClick = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div>
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
              {title}
            </h3>
          </div>
          {/* {className && (
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
            >
              {className}
            </button>
          )} */}
          {/* Action Button */}
          {ModalComponent && (
            <button
              onClick={handleClick}
              className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-white text-sm font-medium shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
            >
              {actionLabel}
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
          <div className="space-y-6">{children}</div>
        </div>
      </div>

      {/* Modal */}
      {ModalComponent && showModal && <ModalComponent onClose={closeModal} />}
    </>
  );
};

export default ComponentCard;
