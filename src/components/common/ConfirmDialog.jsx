import React from "react";
import { Dialog } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-black border border-red-500/30 rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-500/20 rounded-full p-2">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
            </div>
            <Dialog.Title className="text-lg font-semibold text-white">
              {title}
            </Dialog.Title>
          </div>

          <p className="text-white/60 mb-6">{message}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white/60 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-linear-to-r from-red-500 to-red-700 rounded-lg hover:shadow-lg hover:shadow-red-500/25 transition-all duration-200"
            >
              Delete
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
