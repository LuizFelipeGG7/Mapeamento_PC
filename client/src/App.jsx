import { useState, useEffect } from 'react'
import AddForm from './components/AddForm'
import ComputerTable from './components/ComputerTable'
import EditModal from './components/EditModal'

export default function App() {
  const [computers, setComputers]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [editingComputer, setEditing]   = useState(null)

  async function load() {
    try {
      const res = await fetch('/api/computadores')
      setComputers(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function handleAdd(ip, mac, descricao) {
    const res  = await fetch('/api/computadores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip, mac, descricao }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.erro ?? 'Erro desconhecido.')
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja excluir esta máquina?')) return
    const res = await fetch(`/api/computadores/${id}`, { method: 'DELETE' })
    if (res.ok || res.status === 404) load()
  }

  async function handleSave(id, ip, mac, descricao) {
    const res  = await fetch(`/api/computadores/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ip, mac, descricao }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.erro ?? 'Erro desconhecido.')
    setEditing(null)
    load()
  }

  return (
    <div className="container">
      <h1>Inventário de <span>Computadores</span></h1>
      <AddForm onAdd={handleAdd} />
      <ComputerTable
        computers={computers}
        loading={loading}
        onEdit={setEditing}
        onDelete={handleDelete}
      />
      {editingComputer && (
        <EditModal
          computer={editingComputer}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}