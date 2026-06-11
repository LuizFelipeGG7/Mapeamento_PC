# Inventário de Computadores

App web simples para cadastrar máquinas em rede: IP, MAC e descrição.

## Requisitos

- Node.js 20 ou superior
- PostgreSQL 13 ou superior

## Configuração

### 1. Criar o banco de dados no PostgreSQL

```sql
CREATE DATABASE mapeamento_pc;
```

A tabela `computadores` é criada automaticamente pelo servidor na primeira execução.

### 2. Configurar variáveis de ambiente

Copie o arquivo de exemplo e preencha com os dados do seu banco:

```bash
cp .env.example .env
```

Edite o `.env`:

```
DATABASE_URL=postgres://usuario:senha@localhost:5432/mapeamento_pc
PORT=3000
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Iniciar o servidor

```bash
npm start
```

Acesse **http://localhost:3000** no navegador.

## Estrutura

```
├── server.js          # Servidor Express + API REST
├── package.json
├── .env.example
├── public/
│   └── index.html     # Interface (HTML/CSS/JS puro)
└── README.md
```

## API

| Método | Rota                    | Descrição               |
|--------|-------------------------|-------------------------|
| GET    | `/api/computadores`     | Lista todos os registros|
| POST   | `/api/computadores`     | Adiciona uma máquina    |
| DELETE | `/api/computadores/:id` | Remove pelo ID          |

### Exemplo de body (POST)

```json
{ "ip": "192.168.0.10", "mac": "00:1A:2B:3C:4D:5E", "descricao": "Recepção" }
```