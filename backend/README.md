# FlowDesk API

Backend REST do **FlowDesk**, projeto educacional da disciplina Programação Web II.

## Objetivo

Disponibilizar uma API REST independente para gerenciar as tarefas do FlowDesk. As tarefas são gravadas em um banco **MySQL 8**, então continuam disponíveis mesmo depois de o servidor ser reiniciado.

A arquitetura é esta:

```
React + Vite  →  HTTP (fetch)  →  Express  →  Controller  →  Service  →  Repository  →  MySQL 8
```

O frontend nunca acessa o banco diretamente: só o backend abre conexões e executa SQL.

## Tecnologias

- Node.js com ES Modules
- Express 5
- MySQL 8 com `mysql2` (driver com suporte a Promises e pool de conexões)
- Zod (validação de entrada)
- dotenv (leitura do arquivo `.env`)
- cors (liberação de acesso para o frontend)
- swagger-ui-express (documentação interativa da API)

As consultas são escritas à mão em SQL, sem ORM.

## Pré-requisitos

- Node.js 20.12 ou superior
- npm
- MySQL Server 8.0 em execução (instalação em [Instalar o MySQL 8](#instalar-o-mysql-8))
- MySQL Workbench, para executar os scripts SQL e conferir os dados (opcional, mas recomendado para a aula)

## Instalar o MySQL 8

1. Instale o **MySQL Server 8.0** pelo **MySQL Installer for Windows**. Na tela de tipo de instalação, escolha *Developer Default* ou *Server only*.
2. Anote a senha do usuário `root` definida na instalação. Ela é usada apenas para criar o banco e o usuário da aplicação.
3. Confirme que o serviço está em execução. No PowerShell:

   ```powershell
   Get-Service MySQL80
   ```

   O status deve ser `Running`. Se o nome do serviço for diferente, procure por `MySQL` em `services.msc`.

## Criar o banco e o usuário

A aplicação não deve usar o usuário `root`. Crie um usuário específico, com permissão apenas sobre o banco `flowdesk`.

Abra o MySQL Workbench, conecte-se à instância local com o usuário `root` e execute:

```sql
CREATE USER 'flowdesk_user'@'localhost' IDENTIFIED BY 'senha_local';
GRANT SELECT, INSERT, UPDATE, DELETE ON flowdesk.* TO 'flowdesk_user'@'localhost';
```

Troque `senha_local` por uma senha de sua escolha e use a mesma no arquivo `.env`. O banco `flowdesk` é criado pelo `schema.sql`, na próxima etapa; o `GRANT` pode ser executado antes, porque ele apenas concede a permissão.

> Se a conexão for recusada com `ER_ACCESS_DENIED_ERROR`, confira se o usuário foi criado com `'localhost'` e não com outro host.

## Criar a tabela e popular os dados

Execute os dois scripts da pasta `database/`, nesta ordem:

1. **`schema.sql`**: cria o banco `flowdesk` e a tabela `tasks`. Pode ser executado mais de uma vez sem erro.
2. **`seed.sql`**: insere 9 tarefas de exemplo. Execute **uma única vez**, porque cada execução adiciona as tarefas de novo.

No MySQL Workbench, use **File → Open SQL Script**, escolha o arquivo e clique no ícone de raio (**Execute**). Também é possível rodar pelo terminal, a partir da pasta `backend`:

```bash
mysql -u root -p < database/schema.sql
```

```bash
mysql -u root -p < database/seed.sql
```

O servidor **não** executa esses scripts automaticamente.

## Como instalar

Na raiz do repositório:

```bash
cd backend
npm install
cp .env.example .env
```

No PowerShell, use `Copy-Item .env.example .env` no lugar do `cp`.

Edite o `.env` com a senha do usuário criado na seção anterior:

| Variável       | Valor de exemplo        | Descrição                                                                                   |
| -------------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| `PORT`         | `3000`                  | Porta do servidor                                                                           |
| `NODE_ENV`     | `development`           | Com `development`, erros 500 incluem o stack trace. Sem a variável, assume `production`     |
| `FRONTEND_URL` | `http://localhost:5173` | Origem autorizada pelo CORS                                                                 |
| `DB_HOST`      | `localhost`             | Endereço do servidor MySQL                                                                  |
| `DB_PORT`      | `3306`                  | Porta do servidor MySQL                                                                     |
| `DB_NAME`      | `flowdesk`              | Nome do banco                                                                               |
| `DB_USER`      | `flowdesk_user`         | Usuário criado para a aplicação (não use `root`)                                            |
| `DB_PASSWORD`  | `senha_local`           | Senha do usuário acima. O arquivo `.env` nunca deve ser versionado                          |

## Como executar

```bash
npm run dev
```

Reinicia o servidor quando um arquivo do código muda. Para executar sem esse recurso, use `npm start`. Alterações no `.env` exigem reiniciar o comando manualmente.

Ao iniciar, o servidor testa a conexão com o MySQL. Se o banco estiver indisponível, ele mostra a causa no terminal e encerra com código de saída diferente de zero, em vez de subir sem conseguir atender às requisições:

```
Não foi possível conectar ao MySQL em localhost:3306/flowdesk.
Motivo: ECONNREFUSED
Confira as variáveis DB_* no arquivo backend/.env e se o serviço MySQL está em execução.
```

Com o banco disponível, a API fica em **http://localhost:3000/api**.

## Documentação interativa (Swagger)

Com o servidor em execução, abra **http://localhost:3000/api/docs** no navegador. Escolha um endpoint, clique em **Try it out** e depois em **Execute**.

A especificação OpenAPI fica em `src/docs/openapi.js` e é escrita à mão. Ao mudar uma rota ou um campo, atualize também esse arquivo.

## Endpoints

| Método   | Rota             | Descrição                      | Sucesso |
| -------- | ---------------- | ------------------------------ | ------- |
| `GET`    | `/api/health`    | Verifica se a API está no ar   | 200     |
| `GET`    | `/api/tasks`     | Lista as tarefas (com filtros) | 200     |
| `GET`    | `/api/tasks/:id` | Consulta uma tarefa            | 200     |
| `POST`   | `/api/tasks`     | Cria uma tarefa                | 201     |
| `PATCH`  | `/api/tasks/:id` | Atualiza campos de uma tarefa  | 200     |
| `DELETE` | `/api/tasks/:id` | Exclui uma tarefa              | 204     |
| `GET`    | `/api/docs`      | Abre a documentação Swagger    | 200     |

### Modelo de tarefa

```json
{
  "id": 1,
  "title": "Criar protótipo",
  "description": "Criar o protótipo inicial do projeto",
  "assignee": "Marina",
  "priority": "Alta",
  "status": "A fazer",
  "createdAt": "2026-11-03T12:00:00.000Z",
  "updatedAt": "2026-11-03T12:00:00.000Z"
}
```

Na API, os campos usam camelCase. No banco, as datas são `created_at` e `updated_at`; o repository faz essa conversão.

| Campo         | Na criação (`POST`)        | Valores permitidos                                   |
| ------------- | -------------------------- | ---------------------------------------------------- |
| `title`       | Obrigatório                | Texto não vazio, até 150 caracteres                  |
| `description` | Opcional, padrão `""`      | Texto                                                |
| `assignee`    | Opcional, padrão `""`      | Texto, até 100 caracteres                            |
| `priority`    | Opcional, padrão `Média`   | `Alta`, `Média`, `Baixa`                             |
| `status`      | Opcional, padrão `A fazer` | `A fazer`, `Em andamento`, `Em revisão`, `Concluído` |

`id`, `createdAt` e `updatedAt` são gerados pelo banco e não podem ser enviados pelo cliente.

### Filtros de `GET /api/tasks`

Os filtros são opcionais e podem ser combinados.

| Parâmetro  | Comportamento                                                                                                  |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| `status`   | Valor exato; um valor não permitido retorna 400                                                                |
| `priority` | Valor exato; um valor não permitido retorna 400                                                                |
| `assignee` | Nome completo, sem diferenciar maiúsculas de minúsculas                                                        |
| `search`   | Trecho do `title` ou da `description`, sem diferenciar maiúsculas de minúsculas e sem diferenciar acentos      |

A comparação sem diferenciar acentos vem da collation `utf8mb4_unicode_ci` do banco: por isso `revisao` encontra `Revisão`.

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

| Status | `code`                  | Quando ocorre                                                    |
| ------ | ----------------------- | ---------------------------------------------------------------- |
| 400    | `VALIDATION_ERROR`      | Dados, filtros ou `id` inválidos; campos desconhecidos           |
| 400    | `INVALID_JSON`          | Corpo da requisição com JSON malformado                          |
| 404    | `NOT_FOUND`             | Tarefa ou rota inexistente                                       |
| 500    | `INTERNAL_SERVER_ERROR` | Erro inesperado                                                  |
| 503    | `SERVICE_UNAVAILABLE`   | O MySQL parou de responder durante uma requisição                |

Os erros do banco nunca são repassados ao cliente: o detalhe fica só no terminal do servidor. Fora do modo `development`, erros 500 também não trazem stack trace.

## Como testar

A forma mais simples de testar é pela [documentação interativa](#documentação-interativa-swagger). Os exemplos abaixo usam `curl`. No PowerShell, chame `curl.exe` em vez de `curl`, pois `curl` pode ser um atalho para outro comando. No Postman, crie uma requisição com o mesmo método e a mesma URL; para enviar dados, escolha **Body → raw → JSON**.

Os exemplos supõem que o `seed.sql` foi executado em um banco recém-criado, com os IDs de 1 a 9.

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

Com filtros:

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

### Consultar tarefa por ID

```bash
curl -i http://localhost:3000/api/tasks/1
```

Para um ID inexistente, a resposta é HTTP 404:

```bash
curl -i http://localhost:3000/api/tasks/999
```

```json
{ "error": { "code": "NOT_FOUND", "message": "Tarefa 999 não encontrada" } }
```

Para um ID que não é número inteiro positivo, a resposta é HTTP 400:

```bash
curl -i http://localhost:3000/api/tasks/abc
```

### Criar tarefa

```bash
curl -i -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"Implementar autenticação","description":"Criar tela de autenticação","assignee":"Lucas","priority":"Alta","status":"A fazer"}'
```

Resposta HTTP 201, com o ID gerado pelo MySQL:

```json
{
  "id": 10,
  "title": "Implementar autenticação",
  "description": "Criar tela de autenticação",
  "assignee": "Lucas",
  "priority": "Alta",
  "status": "A fazer",
  "createdAt": "2026-11-17T18:30:00.000Z",
  "updatedAt": "2026-11-17T18:30:00.000Z"
}
```

### Atualizar tarefa

Envie apenas os campos que devem mudar. O `updatedAt` é atualizado automaticamente.

```bash
curl -i -X PATCH http://localhost:3000/api/tasks/1 -H "Content-Type: application/json" -d '{"status":"Em andamento"}'
```

Retorna HTTP 200 com a tarefa atualizada.

### Excluir tarefa

```bash
curl -i -X DELETE http://localhost:3000/api/tasks/2
```

Retorna HTTP 204, sem corpo.

### Dados inválidos

```bash
curl -i -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"","priority":"Urgente","id":1}'
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

## Verificar os dados no MySQL Workbench

Com o servidor parado ou em execução, abra uma aba SQL e execute:

```sql
USE flowdesk;

SELECT id, title, assignee, priority, status, created_at, updated_at
FROM tasks
ORDER BY id;
```

Crie uma tarefa pela API (com o `curl` acima) e rode a consulta de novo: a linha nova aparece na tabela.

## Testar a persistência após reiniciar o servidor

1. Inicie o servidor com `npm start`.
2. Crie uma tarefa com o `POST` acima e anote o `id` retornado.
3. Encerre o servidor com `Ctrl+C`.
4. Inicie o servidor de novo com `npm start`.
5. Consulte a tarefa pelo ID: `curl http://localhost:3000/api/tasks/<id>`.

A tarefa continua lá, porque ficou gravada no MySQL e não na memória do processo.

## Estrutura de diretórios

Uma requisição percorre `routes → controllers → services → repositories → MySQL`.

```
backend/
├── database/
│   ├── schema.sql             # Cria o banco flowdesk e a tabela tasks
│   └── seed.sql               # Tarefas de exemplo (executar uma vez)
├── src/
│   ├── config/
│   │   ├── database.js        # Pool de conexões com o MySQL e teste de conexão
│   │   └── env.js             # Lê as variáveis de ambiente
│   ├── docs/openapi.js        # Especificação OpenAPI exibida pelo Swagger
│   ├── repositories/          # Acesso ao banco: SQL parametrizado e tradução snake_case → camelCase
│   ├── services/              # Regras de negócio: tarefa inexistente
│   ├── controllers/           # Recebem a requisição, validam a entrada e enviam a resposta
│   ├── routes/                # Associam método e URL a um controller
│   ├── schemas/               # Regras de validação com Zod
│   ├── errors/app-error.js    # Erro previsto pela aplicação, com status HTTP
│   ├── middlewares/           # Rota inexistente e tratamento centralizado de erros
│   ├── app.js                 # Configura o Express (CORS, JSON, rotas, erros)
│   └── server.js              # Testa o banco e inicia o servidor na porta configurada
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### Conceitos importantes

- **Pool de conexões:** em vez de abrir uma conexão com o MySQL para cada requisição, o `mysql2` mantém até 10 conexões abertas e reutiliza uma delas.
- **Repository:** o único arquivo que escreve SQL é `src/repositories/task.repository.js`. Se o banco mudar, só ele precisa mudar.
- **Consultas parametrizadas:** os valores enviados pelo usuário entram no SQL como `?`, separados da consulta. Nunca concatene texto do usuário dentro de uma string SQL: isso permite injeção de SQL.

## Fora do escopo desta etapa

Autenticação, migrations, ORM e Docker ainda não fazem parte do backend. A validação de entrada também não equivale a uma proteção de segurança completa: o tema será aprofundado na unidade de Segurança em JSON.
