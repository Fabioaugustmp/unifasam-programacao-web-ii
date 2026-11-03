import { z } from 'zod';

export const TASK_STATUSES = ['A fazer', 'Em andamento', 'Em revisão', 'Concluído'];
export const TASK_PRIORITIES = ['Alta', 'Média', 'Baixa'];

const statusSchema = z.enum(TASK_STATUSES, {
  error: `status deve ser um destes valores: ${TASK_STATUSES.join(', ')}`,
});
const prioritySchema = z.enum(TASK_PRIORITIES, {
  error: `priority deve ser um destes valores: ${TASK_PRIORITIES.join(', ')}`,
});

const taskFields = {
  title: z
    .string({ error: 'title é obrigatório e deve ser um texto' })
    .trim()
    .min(1, 'title não pode ser vazio'),
  description: z.string({ error: 'description deve ser um texto' }).trim(),
  assignee: z.string({ error: 'assignee deve ser um texto' }).trim(),
  priority: prioritySchema,
  status: statusSchema,
};

const bodyTypeError = { error: 'O corpo da requisição deve ser um objeto JSON' };

// strictObject rejeita campos desconhecidos, inclusive id, createdAt e updatedAt.
export const createTaskSchema = z.strictObject(
  {
    ...taskFields,
    description: taskFields.description.default(''),
    assignee: taskFields.assignee.default(''),
    priority: taskFields.priority.default('Média'),
    status: taskFields.status.default('A fazer'),
  },
  bodyTypeError,
);

// Os valores padrão ficam só na criação: no PATCH, campo ausente não pode ser alterado.
export const updateTaskSchema = z
  .strictObject(taskFields, bodyTypeError)
  .partial()
  .refine((changes) => Object.keys(changes).length > 0, {
    error: 'Informe ao menos um campo para atualizar',
    // Só faz sentido quando não há outro erro, como um campo não permitido.
    when: ({ issues }) => issues.length === 0,
  });

export const taskFiltersSchema = z.object({
  status: statusSchema.optional(),
  priority: prioritySchema.optional(),
  assignee: z.string({ error: 'assignee deve ser informado uma única vez' }).trim().optional(),
  search: z.string({ error: 'search deve ser informado uma única vez' }).trim().optional(),
});
