import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TIPOS, getTipo } from '../tipos'

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
    transition: { delay: i * 0.04, duration: 0.25, ease: 'easeOut' },
  }),
  exit: { opacity: 0, x: 16, transition: { duration: 0.18 } },
}

export default function ComputerTable({ computers, loading, onEdit, onDelete }) {
  const [sort, setSort]         = useState(null)
  const [filtro, setFiltro]     = useState(null)

  function cycleSort() {
    setSort(prev => SORT_STATES[(SORT_STATES.indexOf(prev) + 1) % SORT_STATES.length])
  }

  const filtrados = filtro ? computers.filter(c => c.tipo === filtro) : computers

  const sorted = sort
    ? [...filtrados].sort((a, b) => {
        const diff = ipToNum(a.ip) - ipToNum(b.ip)
        return sort === 'asc' ? diff : -diff
      })
    : filtrados

  if (loading) {
    return (
      <div className="table-wrap">
        <table>
          <thead><tr><th colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</th></tr></thead>
        </table>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      {/* Filtros por tipo */}
      <div className="filter-tabs">
        <button
          className={filtro === null ? 'filter-tab active' : 'filter-tab'}
          onClick={() => setFiltro(null)}
        >
          Todos
          <span className="tab-count">{computers.length}</span>
        </button>
        {TIPOS.map(t => {
          const count = computers.filter(c => c.tipo === t.value).length
          if (count === 0) return null
          return (
            <button
              key={t.value}
              className={filtro === t.value ? 'filter-tab active' : 'filter-tab'}
              onClick={() => setFiltro(t.value)}
              style={filtro === t.value ? {} : { '--tab-cor': t.cor }}
            >
              <span
                className="tab-dot"
                style={{ background: t.cor }}
              />
              {t.label}
              <span className="tab-count">{count}</span>
            </button>
          )
        })}
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Tipo</th>
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
                <td colSpan="7">Nenhum dispositivo cadastrado.</td>
              </motion.tr>
            ) : (
              sorted.map((c, i) => {
                const tipo = getTipo(c.tipo)
                return (
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
                    <td>
                      <span
                        className="device-badge"
                        style={{
                          background: `${tipo.cor}18`,
                          border: `1px solid ${tipo.cor}40`,
                          color: tipo.cor,
                        }}
                      >
                        {tipo.label}
                      </span>
                    </td>
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
                )
              })
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  )
}