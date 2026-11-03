import { TASK_PRIORITIES, TASK_STATUSES } from '../schemas/task.schema.js';

// Documentação escrita à mão: ao mudar uma rota ou um campo, atualize também este arquivo.

const taskIdParameter = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Identificador da tarefa',
  schema: { type: 'string' },
  example: 'FD-101',
};

const jsonContent = (schema) => ({ 'application/json': { schema } });
const taskResponse = (description) => ({
  description,
  content: jsonContent({ $ref: '#/components/schemas/Task' }),
});

const editableTaskProperties = {
  title: { type: 'string', minLength: 1, example: 'Implementar autenticação' },
  description: { type: 'string', example: 'Criar tela de autenticação' },
  assignee: { type: 'string', example: 'Lucas' },
  priority: { type: 'string', enum: TASK_PRIORITIES, example: 'Alta' },
  status: { type: 'string', enum: TASK_STATUSES, example: 'A fazer' },
};

export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'FlowDesk API',
    version: '1.0.0',
    description:
      'API REST do FlowDesk. Os dados ficam em memória e são perdidos quando o servidor reinicia.',
  },
  servers: [{ url: '/api' }],
  tags: [
    { name: 'Health', description: 'Situação da API' },
    { name: 'Tarefas', description: 'Gerenciamento de tarefas' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Verifica se a API está no ar',
        responses: {
          200: {
            description: 'API em funcionamento',
            content: jsonContent({ $ref: '#/components/schemas/Health' }),
          },
        },
      },
    },
    '/tasks': {
      get: {
        tags: ['Tarefas'],
        summary: 'Lista as tarefas',
        description: 'Os filtros são opcionais e podem ser combinados.',
        parameters: [
          {
            name: 'status',
            in: 'query',
            description: 'Valor exato do status',
            schema: { type: 'string', enum: TASK_STATUSES },
          },
          {
            name: 'priority',
            in: 'query',
            description: 'Valor exato da prioridade',
            schema: { type: 'string', enum: TASK_PRIORITIES },
          },
          {
            name: 'assignee',
            in: 'query',
            description: 'Nome completo do responsável, sem diferenciar maiúsculas de minúsculas',
            schema: { type: 'string' },
          },
          {
            name: 'search',
            in: 'query',
            description: 'Trecho do título ou da descrição, sem diferenciar maiúsculas de minúsculas',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Lista de tarefas',
            content: jsonContent({
              type: 'array',
              items: { $ref: '#/components/schemas/Task' },
            }),
          },
          400: { $ref: '#/components/responses/ValidationError' },
        },
      },
      post: {
        tags: ['Tarefas'],
        summary: 'Cria uma tarefa',
        description: 'O backend gera id, createdAt e updatedAt.',
        requestBody: {
          required: true,
          content: jsonContent({ $ref: '#/components/schemas/TaskCreate' }),
        },
        responses: {
          201: taskResponse('Tarefa criada'),
          400: { $ref: '#/components/responses/ValidationError' },
        },
      },
    },
    '/tasks/{id}': {
      parameters: [taskIdParameter],
      get: {
        tags: ['Tarefas'],
        summary: 'Consulta uma tarefa',
        responses: {
          200: taskResponse('Tarefa encontrada'),
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      patch: {
        tags: ['Tarefas'],
        summary: 'Atualiza campos de uma tarefa',
        description: 'Envie apenas os campos que devem mudar. O updatedAt é atualizado automaticamente.',
        requestBody: {
          required: true,
          content: jsonContent({ $ref: '#/components/schemas/TaskUpdate' }),
        },
        responses: {
          200: taskResponse('Tarefa atualizada'),
          400: { $ref: '#/components/responses/ValidationError' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
      delete: {
        tags: ['Tarefas'],
        summary: 'Exclui uma tarefa',
        responses: {
          204: { description: 'Tarefa excluída' },
          404: { $ref: '#/components/responses/NotFound' },
        },
      },
    },
  },
  components: {
    schemas: {
      Health: {
        type: 'object',
        required: ['status', 'application'],
        properties: {
          status: { type: 'string', example: 'UP' },
          application: { type: 'string', example: 'FlowDesk API' },
        },
      },
      Task: {
        type: 'object',
        required: [
          'id',
          'title',
          'description',
          'assignee',
          'priority',
          'status',
          'createdAt',
          'updatedAt',
        ],
        properties: {
          id: { type: 'string', example: 'FD-110' },
          ...editableTaskProperties,
          createdAt: { type: 'string', format: 'date-time', example: '2026-11-03T18:30:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2026-11-03T18:30:00.000Z' },
        },
      },
      TaskCreate: {
        type: 'object',
        required: ['title'],
        additionalProperties: false,
        properties: {
          ...editableTaskProperties,
          description: { ...editableTaskProperties.description, default: '' },
          assignee: { ...editableTaskProperties.assignee, default: '' },
          priority: { ...editableTaskProperties.priority, default: 'Média' },
          status: { ...editableTaskProperties.status, default: 'A fazer' },
        },
      },
      TaskUpdate: {
        type: 'object',
        minProperties: 1,
        additionalProperties: false,
        properties: {
          ...editableTaskProperties,
          status: { ...editableTaskProperties.status, example: 'Em andamento' },
        },
      },
      Error: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'object',
            required: ['code', 'message'],
            properties: {
              code: { type: 'string' },
              message: { type: 'string' },
              details: {
                type: 'array',
                items: {
                  type: 'object',
                  required: ['field', 'message'],
                  properties: {
                    field: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    responses: {
      ValidationError: {
        description: 'Dados inválidos',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              error: {
                code: 'VALIDATION_ERROR',
                message: 'Dados inválidos',
                details: [{ field: 'title', message: 'title não pode ser vazio' }],
              },
            },
          },
        },
      },
      NotFound: {
        description: 'Tarefa inexistente',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/Error' },
            example: {
              error: { code: 'NOT_FOUND', message: 'Tarefa FD-999 não encontrada' },
            },
          },
        },
      },
    },
  },
};
