import express from 'express';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool, types } = pg;

// TIMESTAMP WITHOUT TIME ZONE vem do Neon em UTC — força interpretação correta
types.setTypeParser(1114, str => new Date(str.replace(' ', 'T') + 'Z'));
const __dirname = dirname(fileURLToPath(import.meta.url));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const IPV4_RE      = /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;
const MAC_RE       = /^([0-9A-Fa-f]{2}[:\-]){5}[0-9A-Fa-f]{2}$/;
const TIPOS_VALIDOS = ['computador', 'impressora', 'antena_wifi', 'nvd', 'camera', 'servidor'];
const DEPTOS_VALIDOS = [
  'administrativo','financeiro','ti','rh','contabilidade','juridico','graneleiro',
  'veterinaria','transporte','supermercado','fabrica_racao','fabrica_nova',
  'caixas_sup','lancamento_notas_sup','caixas_mat','vendedores_mat',
  'caixas_vet','vendedores_vet','lancamento_notas_vet',
];

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS computadores (
      id           SERIAL PRIMARY KEY,
      ip           TEXT NOT NULL UNIQUE,
      mac          TEXT NOT NULL UNIQUE,
      descricao    TEXT,
      tipo         TEXT NOT NULL DEFAULT 'computador',
      departamento TEXT NOT NULL DEFAULT 'ti',
      criado_em    TIMESTAMP NOT NULL DEFAULT now()
    )
  `);
  await pool.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_name = 'computadores' AND constraint_name = 'computadores_ip_key'
      ) THEN
        ALTER TABLE computadores ADD CONSTRAINT computadores_ip_key UNIQUE (ip);
      END IF;
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints
        WHERE table_name = 'computadores' AND constraint_name = 'computadores_mac_key'
      ) THEN
        ALTER TABLE computadores ADD CONSTRAINT computadores_mac_key UNIQUE (mac);
      END IF;
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'computadores' AND column_name = 'tipo'
      ) THEN
        ALTER TABLE computadores ADD COLUMN tipo TEXT NOT NULL DEFAULT 'computador';
      END IF;
      IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'computadores' AND column_name = 'departamento'
      ) THEN
        ALTER TABLE computadores ADD COLUMN departamento TEXT NOT NULL DEFAULT 'ti';
      END IF;
    END $$;
  `);
}

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'client/dist')));

app.get('/api/computadores', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM computadores ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao consultar o banco de dados.' });
  }
});

app.post('/api/computadores', async (req, res) => {
  const { ip, mac, descricao, tipo, departamento } = req.body ?? {};

  if (!ip || !IPV4_RE.test(ip.trim()))
    return res.status(400).json({ erro: 'IP inválido. Use o formato IPv4 (ex.: 192.168.0.1).' });
  if (!mac || !MAC_RE.test(mac.trim()))
    return res.status(400).json({ erro: 'MAC inválido. Use o formato 00:1A:2B:3C:4D:5E (separador ":" ou "-").' });
  if (!tipo || !TIPOS_VALIDOS.includes(tipo))
    return res.status(400).json({ erro: 'Tipo de dispositivo inválido.' });
  if (!departamento || !DEPTOS_VALIDOS.includes(departamento))
    return res.status(400).json({ erro: 'Departamento inválido.' });

  try {
    const { rows } = await pool.query(
      'INSERT INTO computadores (ip, mac, descricao, tipo, departamento) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [ip.trim(), mac.trim().toUpperCase(), descricao?.trim() ?? null, tipo, departamento]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      const campo = err.constraint?.includes('mac') ? 'MAC' : 'IP';
      return res.status(409).json({ erro: `${campo} já cadastrado.` });
    }
    console.error(err);
    res.status(500).json({ erro: 'Erro ao salvar no banco de dados.' });
  }
});

app.put('/api/computadores/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1)
    return res.status(400).json({ erro: 'ID inválido.' });

  const { ip, mac, descricao, tipo, departamento } = req.body ?? {};

  if (!ip || !IPV4_RE.test(ip.trim()))
    return res.status(400).json({ erro: 'IP inválido. Use o formato IPv4 (ex.: 192.168.0.1).' });
  if (!mac || !MAC_RE.test(mac.trim()))
    return res.status(400).json({ erro: 'MAC inválido. Use o formato 00:1A:2B:3C:4D:5E (separador ":" ou "-").' });
  if (!tipo || !TIPOS_VALIDOS.includes(tipo))
    return res.status(400).json({ erro: 'Tipo de dispositivo inválido.' });
  if (!departamento || !DEPTOS_VALIDOS.includes(departamento))
    return res.status(400).json({ erro: 'Departamento inválido.' });

  try {
    const { rows, rowCount } = await pool.query(
      'UPDATE computadores SET ip=$1, mac=$2, descricao=$3, tipo=$4, departamento=$5 WHERE id=$6 RETURNING *',
      [ip.trim(), mac.trim().toUpperCase(), descricao?.trim() ?? null, tipo, departamento, id]
    );
    if (rowCount === 0) return res.status(404).json({ erro: 'Registro não encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      const campo = err.constraint?.includes('mac') ? 'MAC' : 'IP';
      return res.status(409).json({ erro: `${campo} já cadastrado em outro registro.` });
    }
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar o banco de dados.' });
  }
});

app.delete('/api/computadores/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1)
    return res.status(400).json({ erro: 'ID inválido.' });

  try {
    const { rowCount } = await pool.query('DELETE FROM computadores WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ erro: 'Registro não encontrado.' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao remover do banco de dados.' });
  }
});

app.get('*', (_req, res) => res.sendFile(join(__dirname, 'client/dist/index.html')));

const PORT = process.env.PORT ?? 3000;

init()
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`Servidor rodando em http://localhost:${PORT}`)))
  .catch(err => { console.error('Falha ao inicializar:', err); process.exit(1); });