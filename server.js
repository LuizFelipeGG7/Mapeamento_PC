import express from 'express';
import pg from 'pg';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pg;
const __dirname = dirname(fileURLToPath(import.meta.url));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const IPV4_RE = /^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;
const MAC_RE  = /^([0-9A-Fa-f]{2}[:\-]){5}[0-9A-Fa-f]{2}$/;

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS computadores (
      id        SERIAL PRIMARY KEY,
      ip        TEXT NOT NULL,
      mac       TEXT NOT NULL,
      descricao TEXT,
      criado_em TIMESTAMP NOT NULL DEFAULT now()
    )
  `);
}

const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));

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
  const { ip, mac, descricao } = req.body ?? {};

  if (!ip || !IPV4_RE.test(ip.trim())) {
    return res.status(400).json({ erro: 'IP inválido. Use o formato IPv4 (ex.: 192.168.0.1).' });
  }
  if (!mac || !MAC_RE.test(mac.trim())) {
    return res.status(400).json({ erro: 'MAC inválido. Use o formato 00:1A:2B:3C:4D:5E (separador ":" ou "-").' });
  }

  try {
    const { rows } = await pool.query(
      'INSERT INTO computadores (ip, mac, descricao) VALUES ($1, $2, $3) RETURNING *',
      [ip.trim(), mac.trim().toUpperCase(), descricao?.trim() ?? null]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao salvar no banco de dados.' });
  }
});

app.put('/api/computadores/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  const { ip, mac, descricao } = req.body ?? {};

  if (!ip || !IPV4_RE.test(ip.trim())) {
    return res.status(400).json({ erro: 'IP inválido. Use o formato IPv4 (ex.: 192.168.0.1).' });
  }
  if (!mac || !MAC_RE.test(mac.trim())) {
    return res.status(400).json({ erro: 'MAC inválido. Use o formato 00:1A:2B:3C:4D:5E (separador ":" ou "-").' });
  }

  try {
    const { rows, rowCount } = await pool.query(
      'UPDATE computadores SET ip=$1, mac=$2, descricao=$3 WHERE id=$4 RETURNING *',
      [ip.trim(), mac.trim().toUpperCase(), descricao?.trim() ?? null, id]
    );
    if (rowCount === 0) return res.status(404).json({ erro: 'Registro não encontrado.' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao atualizar o banco de dados.' });
  }
});

app.delete('/api/computadores/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ erro: 'ID inválido.' });
  }

  try {
    const { rowCount } = await pool.query('DELETE FROM computadores WHERE id = $1', [id]);
    if (rowCount === 0) return res.status(404).json({ erro: 'Registro não encontrado.' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao remover do banco de dados.' });
  }
});

const PORT = process.env.PORT ?? 3000;

init()
  .then(() => app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`)))
  .catch(err => { console.error('Falha ao inicializar:', err); process.exit(1); });