import { AlertTriangle, X } from 'lucide-react';

export function AlertModal({ 
  isOpen, 
  onClose, 
  title = "Atenção", 
  message, 
  icon = AlertTriangle,
  type = "warning"
}) {
  if (!isOpen) return null;

  const typeStyles = {
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: "text-amber-600",
      title: "text-amber-900",
      message: "text-amber-800",
      button: "bg-amber-600 hover:bg-amber-700 text-white"
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200", 
      icon: "text-red-600",
      title: "text-red-900",
      message: "text-red-800",
      button: "bg-red-600 hover:bg-red-700 text-white"
    },
    info: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600", 
      title: "text-blue-900",
      message: "text-blue-800",
      button: "bg-blue-600 hover:bg-blue-700 text-white"
    }
  };

  const styles = typeStyles[type] || typeStyles.warning;
  const IconComponent = icon;

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
                <IconComponent className={`w-6 h-6 ${styles.icon}`} />
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
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg font-medium ${styles.button} transition-all duration-200 transform hover:scale-[1.02] shadow-md`}
            >
              Entendido
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
