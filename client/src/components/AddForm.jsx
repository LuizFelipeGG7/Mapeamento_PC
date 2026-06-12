import { useState } from 'react'
import { motion } from 'framer-motion'
import { TIPOS } from '../tipos'

export default function AddForm({ onAdd }) {
  const [tipo, setTipo]           = useState('computador')
  const [ip, setIp]               = useState('')
  const [mac, setMac]             = useState('')
  const [descricao, setDescricao] = useState('')
  const [erro, setErro]           = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    try {
      await onAdd(ip.trim(), mac.trim(), descricao.trim(), tipo)
      setIp('')
      setMac('')
      setDescricao('')
      setTipo('computador')
    } catch (err) {
      setErro(err.message)
    }
  }

  return (
    <div className="card">
      <h2>Adicionar dispositivo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="tipo">Tipo</label>
            <select
              id="tipo"
              value={tipo}
              onChange={e => setTipo(e.target.value)}
            >
              {TIPOS.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="ip">Endereço IP</label>
            <input
              id="ip"
              type="text"
              placeholder="192.168.0.10"
              autoComplete="off"
              value={ip}
              onChange={e => setIp(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="mac">Endereço MAC</label>
            <input
              id="mac"
              type="text"
              placeholder="00:1A:2B:3C:4D:5E"
              autoComplete="off"
              value={mac}
              onChange={e => setMac(e.target.value)}
            />
          </div>
          <div className="field wide">
            <label htmlFor="descricao">Descrição</label>
            <input
              id="descricao"
              type="text"
              placeholder="Ex.: Recepção — Dell Optiplex"
              autoComplete="off"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
            />
          </div>
        </div>
        <div className="form-actions">
          <motion.button
            className="btn-add"
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Adicionar
          </motion.button>
        </div>
        {erro && (
          <motion.div
            className="msg-error"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {erro}
          </motion.div>
        )}
      </form>
    </div>
  )
}