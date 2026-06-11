import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function formatDate(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  })
}

function ipToNum(ip) {
  return ip.split('.').reduce((acc, oct) => (acc * 256) + parseInt(oct, 10), 0)
}

const SORT_STATES = [null, 'asc', 'desc']
const SORT_ICONS  = { null: '⇅', asc: '↑', desc: '↓' }

const rowVariants = {
  hidden:  { opacity: 0, x: -12 },
  visible: i => ({
    opacity: 1, x: 0,
    transition: { delay: i * 0.045, duration: 0.25, ease: 'easeOut' },
  }),
  exit: { opacity: 0, x: 16, transition: { duration: 0.18 } },
}

export default function ComputerTable({ computers, loading, onEdit, onDelete }) {
  const [sort, setSort] = useState(null)

  function cycleSort() {
    setSort(prev => SORT_STATES[(SORT_STATES.indexOf(prev) + 1) % SORT_STATES.length])
  }

  const sorted = sort
    ? [...computers].sort((a, b) => {
        const diff = ipToNum(a.ip) - ipToNum(b.ip)
        return sort === 'asc' ? diff : -diff
      })
    : computers

  if (loading) {
    return (
      <div className="table-wrap">
        <table>
          <thead><tr><th colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</th></tr></thead>
        </table>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>
              <button className="th-sort" onClick={cycleSort}>
                IP <span className={sort ? 'sort-icon active' : 'sort-icon'}>{SORT_ICONS[sort]}</span>
              </button>
            </th>
            <th>MAC</th>
            <th>Descrição</th>
            <th>Cadastrado em</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence initial={true}>
            {sorted.length === 0 ? (
              <motion.tr
                className="empty-row"
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <td colSpan="6">Nenhuma máquina cadastrada.</td>
              </motion.tr>
            ) : (
              sorted.map((c, i) => (
                <motion.tr
                  key={c.id}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                >
                  <td className="muted">{c.id}</td>
                  <td className="mono">{c.ip}</td>
                  <td className="mono">{c.mac}</td>
                  <td>{c.descricao || <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                  <td className="muted">{formatDate(c.criado_em)}</td>
                  <td>
                    <div className="btn-actions">
                      <motion.button
                        className="btn-edit"
                        onClick={() => onEdit(c)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Editar
                      </motion.button>
                      <motion.button
                        className="btn-del"
                        onClick={() => onDelete(c.id)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Remover
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}