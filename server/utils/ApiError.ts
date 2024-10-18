class ApiError extends Error {
    statusCode: number; // Declare the statusCode property
  
    constructor(statusCode: number, message: string) {
      super(message);
  
      this.name = "ApiError";
      this.statusCode = statusCode;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class BadRequestError extends ApiError {
    constructor(message: string) {
      super(400, message);
    }
  }
  
  export class UnauthorizedError extends ApiError {
    constructor(message: string) {
      super(401, message);
    }
  }
  
  export class ForbiddenError extends ApiError {
    constructor(message: string) {
      super(403, message);
    }
  }
  
  export class NotFoundError extends ApiError {
    constructor(message: string) {
      super(404, message);
    }
  }
  
  export class InteralServerError extends ApiError {
    constructor(message: string) {
      super(500, message);
    }
  }
  
  export class NotImplemented extends ApiError {
    constructor(message: string) {
      super(501, message);
    }
  }