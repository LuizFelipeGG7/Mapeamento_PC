import { motion } from 'framer-motion'

export default function ConfirmModal({ message, onConfirm, onClose }) {
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleOverlayClick}
    >
      <motion.div
        className="modal confirm-modal"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <div className="confirm-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </div>
        <h3 className="confirm-title">Confirmar exclusão</h3>
        <p className="confirm-message">{message}</p>
        <div className="modal-actions">
          <motion.button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            whileTap={{ scale: 0.96 }}
          >
            Cancelar
          </motion.button>
          <motion.button
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Excluir
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
