import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors: { [key: string]: string[] } = {};
    errors.array().forEach((err) => {
      if ('path' in err) {
        if (!extractedErrors[err.path]) {
          extractedErrors[err.path] = [];
        }
        extractedErrors[err.path].push(err.msg);
      }
    });

    res.status(422).json({
      message: 'Dữ liệu không hợp lệ',
      code: 'VALIDATION_ERROR',
      details: extractedErrors,
    });
  };
};
