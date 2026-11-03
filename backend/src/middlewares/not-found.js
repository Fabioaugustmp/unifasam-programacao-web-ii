import { AppError } from '../errors/app-error.js';

export function notFound(req, res, next) {
  next(new AppError(404, 'NOT_FOUND', `Rota ${req.method} ${req.path} não encontrada`));
}
