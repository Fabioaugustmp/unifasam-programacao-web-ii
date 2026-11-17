import { ZodError } from 'zod';
import { env } from '../config/env.js';
import { AppError } from '../errors/app-error.js';

// Códigos que o mysql2 usa quando o servidor não responde ou não aceita novas conexões.
const UNAVAILABLE_DATABASE_ERROR_CODES = new Set([
  'ECONNREFUSED',
  'ENOTFOUND',
  'ETIMEDOUT',
  'PROTOCOL_CONNECTION_LOST',
  'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR',
  'ER_CON_COUNT_ERROR',
]);

function formatValidationIssues(issues) {
  return issues.flatMap((issue) => {
    if (issue.code === 'unrecognized_keys') {
      return issue.keys.map((key) => ({ field: key, message: `Campo não permitido: ${key}` }));
    }
    return [{ field: issue.path.join('.') || 'body', message: issue.message }];
  });
}

function sendError(res, statusCode, error) {
  res.status(statusCode).json({ error });
}

// O Express só reconhece um middleware de erros quando ele declara os 4 parâmetros.
export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ZodError) {
    sendError(res, 400, {
      code: 'VALIDATION_ERROR',
      message: 'Dados inválidos',
      details: formatValidationIssues(error.issues),
    });
    return;
  }

  if (error instanceof AppError) {
    sendError(res, error.statusCode, { code: error.code, message: error.message });
    return;
  }

  if (error.type === 'entity.parse.failed') {
    sendError(res, 400, { code: 'INVALID_JSON', message: 'O corpo da requisição não é um JSON válido' });
    return;
  }

  // Outros erros 4xx gerados pelo Express, como um corpo grande demais.
  if (error.status >= 400 && error.status < 500) {
    sendError(res, error.status, { code: 'BAD_REQUEST', message: 'Requisição inválida' });
    return;
  }

  // Banco fora do ar ou sem conexões disponíveis: o cliente pode tentar de novo mais tarde.
  if (UNAVAILABLE_DATABASE_ERROR_CODES.has(error.code)) {
    console.error(`Banco de dados indisponível: ${error.code}`);
    sendError(res, 503, { code: 'SERVICE_UNAVAILABLE', message: 'Banco de dados indisponível no momento' });
    return;
  }

  console.error(error);
  sendError(res, 500, {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Erro interno do servidor',
    ...(env.nodeEnv === 'development' && { stack: error.stack }),
  });
}
