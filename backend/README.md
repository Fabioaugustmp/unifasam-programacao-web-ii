# FlowDesk API

Backend REST do **FlowDesk**, projeto educacional da disciplina Programação Web II.

## Objetivo

Disponibilizar uma API REST independente para gerenciar as tarefas do FlowDesk, demonstrando a separação entre frontend e backend. O frontend React ainda não consome esta API: a integração com `fetch` será feita em uma etapa posterior.

> ⚠️ **Os dados ficam apenas em memória e são perdidos sempre que o servidor reinicia.** Veja [Limitação do armazenamento em memória](#limitação-do-armazenamento-em-memória).

## Tecnologias

- Node.js com ES Modules
- Express 5
- Zod (validação de entrada)
- cors (liberação de acesso para o frontend)
- swagger-ui-express (documentação interativa da API)

As variáveis do arquivo `.env` são lidas com `process.loadEnvFile`, recurso nativo do Node.js, sem dependência adicional.

## Pré-requisitos

- Node.js 20.12 ou superior
- npm

## Como instalar

Na raiz do repositório:

```bash
cd backend
npm install
cp .env.example .env
```

No PowerShell, use `Copy-Item .env.example .env` no lugar do `cp`.

| Variável       | Valor de exemplo        | Descrição                                                                          |
| -------------- | ----------------------- | ---------------------------------------------------------------------------------- |
| `PORT`         | `3000`                  | Porta do servidor                                                                  |
| `NODE_ENV`     | `development`           | Com `development`, erros 500 incluem o stack trace. Sem a variável, assume `production` |
| `FRONTEND_URL` | `http://localhost:5173` | Origem autorizada pelo CORS                                                        |

## Como executar

```bash
npm run dev
```

Reinicia o servidor quando um arquivo do código muda. Para executar sem esse recurso, use `npm start`. Alterações no `.env` exigem reiniciar o comando manualmente.

A API fica disponível em **http://localhost:3000/api**.

## Documentação interativa (Swagger)

Com o servidor em execução, abra **http://localhost:3000/api/docs** no navegador. A página lista os endpoints e permite testá-los: escolha um endpoint, clique em **Try it out** e depois em **Execute**.

A especificação OpenAPI fica em `src/docs/openapi.js` e é escrita à mão. Ao mudar uma rota ou um campo, atualize também esse arquivo.

## Endpoints

| Método   | Rota             | Descrição                     | Sucesso |
| -------- | ---------------- | ----------------------------- | ------- |
| `GET`    | `/api/health`    | Verifica se a API está no ar  | 200     |
| `GET`    | `/api/tasks`     | Lista as tarefas (com filtros) | 200     |
| `GET`    | `/api/tasks/:id` | Consulta uma tarefa           | 200     |
| `POST`   | `/api/tasks`     | Cria uma tarefa               | 201     |
| `PATCH`  | `/api/tasks/:id` | Atualiza campos de uma tarefa | 200     |
| `DELETE` | `/api/tasks/:id` | Exclui uma tarefa             | 204     |
| `GET`    | `/api/docs`      | Abre a documentação Swagger   | 200     |

### Modelo de tarefa

```json
{
  "id": "FD-101",
  "title": "Criar protótipo",
  "description": "Criar o protótipo inicial do projeto",
  "assignee": "Marina",
  "priority": "Alta",
  "status": "A fazer",
  "createdAt": "2026-11-03T12:00:00.000Z",
  "updatedAt": "2026-11-03T12:00:00.000Z"
}
```

| Campo         | Na criação (`POST`)                | Valores permitidos                                  |
| ------------- | ---------------------------------- | --------------------------------------------------- |
| `title`       | Obrigatório                        | Texto não vazio                                     |
| `description` | Opcional, padrão `""`              | Texto                                               |
| `assignee`    | Opcional, padrão `""`              | Texto                                               |
| `priority`    | Opcional, padrão `Média`           | `Alta`, `Média`, `Baixa`                            |
| `status`      | Opcional, padrão `A fazer`         | `A fazer`, `Em andamento`, `Em revisão`, `Concluído` |

`id`, `createdAt` e `updatedAt` são gerados pelo backend e não podem ser enviados pelo cliente.

### Filtros de `GET /api/tasks`

Os filtros são opcionais e podem ser combinados.

| Parâmetro  | Comportamento                                                 |
| ---------- | ------------------------------------------------------------- |
| `status`   | Valor exato; um valor não permitido retorna 400               |
| `priority` | Valor exato; um valor não permitido retorna 400               |
| `assignee` | Nome completo, sem diferenciar maiúsculas de minúsculas       |
| `search`   | Trecho do `title` ou da `description`, sem diferenciar maiúsculas de minúsculas (acentos são considerados) |

### Formato dos erros

Todos os erros seguem o mesmo formato JSON. O campo `details` só aparece em erros de validação.

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      { "field": "title", "message": "title não pode ser vazio" }
    ]
  }
}
```

| Status | `code`                  | Quando ocorre                                  |
| ------ | ----------------------- | ---------------------------------------------- |
| 400    | `VALIDATION_ERROR`      | Dados ou filtros inválidos, campos desconhecidos |
| 400    | `INVALID_JSON`          | Corpo da requisição com JSON malformado        |
| 404    | `NOT_FOUND`             | Tarefa ou rota inexistente                     |
| 500    | `INTERNAL_SERVER_ERROR` | Erro inesperado                                |

Fora do modo `development`, erros 500 não trazem detalhes internos: o stack trace aparece apenas no terminal do servidor.

## Como testar

A forma mais simples de testar é pela [documentação interativa](#documentação-interativa-swagger). Os exemplos abaixo usam `curl`. No PowerShell, chame `curl.exe` em vez de `curl`, pois `curl` pode ser um atalho para outro comando. No Postman, crie uma requisição com o mesmo método e a mesma URL; para enviar dados, escolha **Body → raw → JSON**.

### Health check

```bash
curl -i http://localhost:3000/api/health
```

```json
{ "status": "UP", "application": "FlowDesk API" }
```

### Listar tarefas

```bash
curl http://localhost:3000/api/tasks
```

Retorna um array com as tarefas. Com filtros:

```bash
curl "http://localhost:3000/api/tasks?status=A%20fazer"
```

```bash
curl "http://localhost:3000/api/tasks?priority=Alta"
```

```bash
curl "http://localhost:3000/api/tasks?assignee=Marina"
```

```bash
curl "http://localhost:3000/api/tasks?search=login"
```

```json
[
  {
    "id": "FD-103",
    "title": "Criar tela de login",
    "description": "Criar o formulário de login da aplicação",
    "assignee": "Lucas",
    "priority": "Média",
    "status": "A fazer",
    "createdAt": "2026-11-03T12:10:00.000Z",
    "updatedAt": "2026-11-03T12:10:00.000Z"
  }
]
```

### Consultar tarefa por ID

```bash
curl -i http://localhost:3000/api/tasks/FD-101
```

Para um ID inexistente, a resposta é HTTP 404:

```json
{ "error": { "code": "NOT_FOUND", "message": "Tarefa FD-999 não encontrada" } }
```

### Criar tarefa

```bash
curl -i -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"Implementar autenticação","description":"Criar tela de autenticação","assignee":"Lucas","priority":"Alta","status":"A fazer"}'
```

Resposta HTTP 201:

```json
{
  "id": "FD-110",
  "title": "Implementar autenticação",
  "description": "Criar tela de autenticação",
  "assignee": "Lucas",
  "priority": "Alta",
  "status": "A fazer",
  "createdAt": "2026-11-03T18:30:00.000Z",
  "updatedAt": "2026-11-03T18:30:00.000Z"
}
```

### Atualizar tarefa

Envie apenas os campos que devem mudar. O `updatedAt` é atualizado automaticamente.

```bash
curl -i -X PATCH http://localhost:3000/api/tasks/FD-101 -H "Content-Type: application/json" -d '{"status":"Em andamento"}'
```

Retorna HTTP 200 com a tarefa atualizada.

### Excluir tarefa

```bash
curl -i -X DELETE http://localhost:3000/api/tasks/FD-102
```

Retorna HTTP 204, sem corpo.

### Dados inválidos

```bash
curl -i -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"","priority":"Urgente","id":"FD-1"}'
```

Resposta HTTP 400:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      { "field": "title", "message": "title não pode ser vazio" },
      { "field": "priority", "message": "priority deve ser um destes valores: Alta, Média, Baixa" },
      { "field": "id", "message": "Campo não permitido: id" }
    ]
  }
}
```

## Estrutura de diretórios

Uma requisição percorre `routes → controllers → services → repositories`.

```
backend/
├── src/
│   ├── config/env.js          # Lê as variáveis de ambiente
│   ├── data/seed.js           # Tarefas iniciais
│   ├── docs/openapi.js        # Especificação OpenAPI exibida pelo Swagger
│   ├── repositories/          # Acesso aos dados (hoje, um array em memória)
│   ├── services/              # Regras de negócio: timestamps e tarefa inexistente
│   ├── controllers/           # Recebem a requisição, validam a entrada e enviam a resposta
│   ├── routes/                # Associam método e URL a um controller
│   ├── schemas/               # Regras de validação com Zod
│   ├── errors/app-error.js    # Erro previsto pela aplicação, com status HTTP
│   ├── middlewares/           # Rota inexistente e tratamento centralizado de erros
│   ├── app.js                 # Configura o Express (CORS, JSON, rotas, erros)
│   └── server.js              # Inicia o servidor na porta configurada
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Limitação do armazenamento em memória

As tarefas ficam em um array no processo do Node.js. Por isso:

- **Toda criação, alteração ou exclusão é perdida quando o servidor reinicia**, e as tarefas iniciais voltam ao estado original. O `npm run dev` reinicia o servidor a cada arquivo salvo, então isso acontece com frequência durante o desenvolvimento.
- Os dados não são compartilhados entre vários processos do servidor.

Em uma etapa futura, SQLite ou PostgreSQL podem substituir o array reescrevendo apenas `src/repositories/task.repository.js`, mantendo os mesmos nomes de função e os mesmos retornos.

## Fora do escopo desta etapa

Autenticação, banco de dados e Docker ainda não fazem parte do backend. A validação de entrada também não equivale a uma proteção de segurança completa: o tema será aprofundado na unidade de Segurança em JSON.
