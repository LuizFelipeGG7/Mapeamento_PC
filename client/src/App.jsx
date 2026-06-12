import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AddForm from './components/AddForm'
import ComputerTable from './components/ComputerTable'
import EditModal from './components/EditModal'
import ConfirmModal from './components/ConfirmModal'

export default function App() {
  const [computers, setComputers]     = useState([])
  const [loading, setLoading]         = useState(true)
  const [editingComputer, setEditing] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  async function load() {
    try {
      const res = await fetch('/api/computadores')
      setComputers(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleAdd(ip, mac, descricao, tipo) {
    const res  = await fetch('/api/computadores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip, mac, descricao, tipo }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.erro ?? 'Erro desconhecido.')
    load()
  }

  async function confirmDelete() {
    const res = await fetch(`/api/computadores/${pendingDelete}`, { method: 'DELETE' })
    setPendingDelete(null)
    if (res.ok || res.status === 404) load()
  }

  async function handleSave(id, ip, mac, descricao, tipo) {
    const res  = await fetch(`/api/computadores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip, mac, descricao, tipo }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.erro ?? 'Erro desconhecido.')
    setEditing(null)
    load()
  }

  return (
    <div className="container">
      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Inventário de <span>Computadores</span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <AddForm onAdd={handleAdd} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.18 }}
      >
        <ComputerTable
          computers={computers}
          loading={loading}
          onEdit={setEditing}
          onDelete={setPendingDelete}
        />
      </motion.div>

      <AnimatePresence>
        {editingComputer && (
          <EditModal
            key="edit-modal"
            computer={editingComputer}
            onSave={handleSave}
            onClose={() => setEditing(null)}
          />
        )}
        {pendingDelete !== null && (
          <ConfirmModal
            key="confirm-modal"
            message="Esta ação é permanente e não pode ser desfeita."
            onConfirm={confirmDelete}
            onClose={() => setPendingDelete(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}