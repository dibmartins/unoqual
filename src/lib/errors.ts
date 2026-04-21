export type ErrorCode = 
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "INTERNAL_ERROR"
  | "BUSINESS_RULE_VIOLATION";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;

  constructor(message: string, code: ErrorCode = "INTERNAL_ERROR", statusCode: number = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    
    // Mantém o stack trace original
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  static notFound(message: string = "Recurso não encontrado") {
    return new AppError(message, "NOT_FOUND", 404);
  }

  static validation(message: string) {
    return new AppError(message, "VALIDATION_ERROR", 400);
  }

  static unauthorized(message: string = "Não autorizado") {
    return new AppError(message, "UNAUTHORIZED", 401);
  }

  static businessRule(message: string) {
    return new AppError(message, "BUSINESS_RULE_VIOLATION", 422);
  }
}

export type ActionResponse<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string; code?: ErrorCode };
