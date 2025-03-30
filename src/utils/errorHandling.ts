import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
  VerifyErrors,
} from "jsonwebtoken";
import { MulterError } from "multer";

export class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status || 500;
    this.name = "CustomError";
  }
}

type ControllerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | Promise<any>;

export const asyncHandler = (controller: ControllerFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    controller(req, res, next).catch((err) => {
      next(err);
    });
  };
};

// Multer error handler
export const multerErrorHandler = (
  err: MulterError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message = "File upload error.";
  let statusCode = 400;

  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      message = "File size exceeds the allowed limit.";
      break;
    case "LIMIT_FILE_COUNT":
      message = "Too many files uploaded.";
      break;
    case "LIMIT_UNEXPECTED_FILE":
      message = "Unexpected file field.";
      break;
    default:
      statusCode = 500;
      message = err.message || "File upload error.";
  }
  return res.status(statusCode).json({ success: false, message, statusCode });
};

// Custom error handler
export const customErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res
    .status(err.status)
    .json({ success: false, message: err.message, statusCode: err.status });
};

// Token error handler
export const tokenErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message = "Token Error";
  let statusCode = 500;
  if (err instanceof TokenExpiredError) {
    message = "Token verification failed: Token has expired";
    statusCode = 401;
  } else if (err instanceof NotBeforeError) {
    message = "Token verification failed: Token not active yet";
    statusCode = 401;
  } else if (err instanceof JsonWebTokenError) {
    message = `Token verification failed: ${err.message}`;
    statusCode = 400;
  } else {
    message = "Authentication error. Please login again.";
    statusCode = 401;
  }

  return res.status(statusCode).json({
    success: false,
    message: message,
    statusCode: statusCode,
  });
};

// General error handler
export const generalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error.",
    statusCode,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

//ERROR HANDLING
export const errorHandler: ErrorRequestHandler | any = (
  err:
    | Error
    | CustomError
    | MulterError
    | JsonWebTokenError
    | TokenExpiredError
    | NotBeforeError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof MulterError) {
    return multerErrorHandler(err, req, res, next);
  } else if (err instanceof CustomError) {
    return customErrorHandler(err, req, res, next);
  } else if (
    err instanceof (JsonWebTokenError || TokenExpiredError || NotBeforeError) ||
    err.message.includes("jwt expired")
  ) {
    console.log("eloowwwwwwwww");

    return tokenErrorHandler(err, req, res, next);
  } else {
    return generalErrorHandler(err, req, res, next);
  }
};
