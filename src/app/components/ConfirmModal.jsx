import { Trash2, X } from 'lucide-react';

export function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar Exclusão", 
  message, 
  itemName = "",
  type = "danger",
  confirmText = "Sim",
  cancelText = "Não"
}) {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      title: "text-red-900",
      message: "text-red-800",
      confirmButton: "bg-red-600 hover:bg-red-700 text-white",
      cancelButton: "bg-gray-200 hover:bg-gray-300 text-gray-800"
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
      title: "text-amber-900",
      message: "text-amber-800",
      confirmButton: "bg-amber-600 hover:bg-amber-700 text-white",
      cancelButton: "bg-gray-200 hover:bg-gray-300 text-gray-800"
    }
  };

  const styles = typeStyles[type] || typeStyles.danger;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className={`${styles.bg} ${styles.border} rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${styles.bg} rounded-xl border ${styles.border}`}>
                <Trash2 className={`w-6 h-6 ${styles.icon}`} />
              </div>
              <div>
                <h3 className={`text-lg font-semibold ${styles.title}`}>
                  {title}
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-1 rounded-lg ${styles.bg} ${styles.icon} hover:bg-black/10 transition-colors`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className={`${styles.message} leading-relaxed`}>
              {message}
            </p>
            {itemName && (
              <p className={`mt-2 font-medium ${styles.title}`}>
                "{itemName}"
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-medium ${styles.cancelButton} transition-all duration-200`}
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-6 py-2 rounded-lg font-medium ${styles.confirmButton} transition-all duration-200 transform hover:scale-[1.02] shadow-md`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
