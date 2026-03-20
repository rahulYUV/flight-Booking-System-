import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validate = (schema: ZodSchema) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
  } catch (error) {
    if (error instanceof ZodError) {
      const zodError = error as any;
      return res.status(400).json({
        message: 'Invalid Input Type',
        errors: zodError.errors.map((e: any) => `${e.path.join('.')} - ${e.message}`)
      });
    }
    next(error);
  }
};
