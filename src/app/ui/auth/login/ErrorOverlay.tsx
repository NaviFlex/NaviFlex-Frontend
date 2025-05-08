import { motion, AnimatePresence } from 'framer-motion';

type ErrorMessageProps = {
  message: string;
  show: boolean;
  type?: 'error' | 'success';
  onClose?: () => void;
};

export default function ErrorOverlay({ message, show, type = 'error' , onClose }: ErrorMessageProps) {
  return (
    <AnimatePresence>
      {show && (
          <motion.div
            key="error-overlay"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.4 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 transition 
              ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}
        >
          <div className="flex items-center gap-2">
            <span>{message}</span>
            {onClose && (
              <button
                onClick={onClose}
                className="ml-4 text-white font-bold hover:text-red-200 transition cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
