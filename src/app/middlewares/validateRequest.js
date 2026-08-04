import { z } from "zod";

export const validateRequest = (zodSchema) => {
  return async (req, res, next) => {
    try {
      if (req.body?.data) {
        req.body = JSON.parse(req.body.data);
      }

      req.body = await zodSchema.parseAsync(req.body);

      next();
    } catch (error) {
      next(error);
    }
  };
};
