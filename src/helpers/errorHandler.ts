import { Request, Response, NextFunction } from "express";

class ErrorHandler {
  errorLogger(error: any, req: Request, res: Response, next: NextFunction) {
    console.error(error);
    next(error);
  }

  errorResponder(error: any, req: Request, res: Response, next: NextFunction) {
    if (error.type === "time-out") {
      res.status(408).send(error.message);
    } else {
      res.status(409).send(error.message);
    }
  }
}

const ErrorHandlerInstance = new ErrorHandler();
export default ErrorHandlerInstance;
