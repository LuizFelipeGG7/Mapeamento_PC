import { useState } from 'react'
import { motion } from 'framer-motion'

export default function EditModal({ computer, onSave, onClose }) {
  const [ip, setIp]               = useState(computer.ip)
  const [mac, setMac]             = useState(computer.mac)
  const [descricao, setDescricao] = useState(computer.descricao ?? '')
  const [erro, setErro]           = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    try {
      await onSave(computer.id, ip.trim(), mac.trim(), descricao.trim())
    } catch (err) {
      setErro(err.message)
    }
  }

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
        className="modal"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <h2>Editar máquina</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label htmlFor="edit-ip">Endereço IP</label>
              <input
                id="edit-ip"
                type="text"
                placeholder="192.168.0.10"
                autoComplete="off"
                value={ip}
                onChange={e => setIp(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="edit-mac">Endereço MAC</label>
              <input
                id="edit-mac"
                type="text"
                placeholder="00:1A:2B:3C:4D:5E"
                autoComplete="off"
                value={mac}
                onChange={e => setMac(e.target.value)}
              />
            </div>
            <div className="field wide">
              <label htmlFor="edit-descricao">Descrição</label>
              <input
                id="edit-descricao"
                type="text"
                placeholder="Ex.: Recepção — Dell Optiplex"
                autoComplete="off"
                value={descricao}
                onChange={e => setDescricao(e.target.value)}
              />
            </div>
          </div>
          {erro && <div className="msg-error">{erro}</div>}
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
              type="submit"
              className="btn-add"
              whileTap={{ scale: 0.96 }}
            >
              Salvar
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}