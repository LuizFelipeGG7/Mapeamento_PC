import { useState } from 'react'

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

export default function ComputerTable({ computers, loading, onEdit, onDelete }) {
  const [sort, setSort] = useState(null)

  function cycleSort() {
    setSort(prev => {
      const next = SORT_STATES[(SORT_STATES.indexOf(prev) + 1) % SORT_STATES.length]
      return next
    })
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
          <thead><tr><th colSpan="6">Carregando...</th></tr></thead>
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
          {sorted.length === 0 ? (
            <tr className="empty-row">
              <td colSpan="6">Nenhuma máquina cadastrada.</td>
            </tr>
          ) : (
            sorted.map(c => (
              <tr key={c.id}>
                <td className="muted">{c.id}</td>
                <td className="mono">{c.ip}</td>
                <td className="mono">{c.mac}</td>
                <td>{c.descricao || <span style={{ color: 'var(--muted)' }}>—</span>}</td>
                <td className="muted">{formatDate(c.criado_em)}</td>
                <td>
                  <div className="btn-actions">
                    <button className="btn-edit" onClick={() => onEdit(c)}>Editar</button>
                    <button className="btn-del" onClick={() => onDelete(c.id)}>Remover</button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}