function formatDate(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
    timeZone: 'America/Sao_Paulo',
  })
}

export default function ComputerTable({ computers, loading, onEdit, onDelete }) {
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
            <th>IP</th>
            <th>MAC</th>
            <th>Descrição</th>
            <th>Cadastrado em</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {computers.length === 0 ? (
            <tr className="empty-row">
              <td colSpan="6">Nenhuma máquina cadastrada.</td>
            </tr>
          ) : (
            computers.map(c => (
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