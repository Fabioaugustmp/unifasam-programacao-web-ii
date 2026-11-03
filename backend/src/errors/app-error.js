// Erro previsto pela aplicação: o middleware de erros usa statusCode e code na resposta.
export class AppError extends Error {
  constructor(statusCode, code, message) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}
