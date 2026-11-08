import { z } from "zod";

export const validateRequest = (zodSchema) => {
  return async (req, res, next) => {
    try {
      await zodSchema.parseAsync(req.body);

      next();

      console.log("Request Body:", req.body);
    } catch (error) {
      console.log("Validation Issues:", error.issues);

      next(error);
    }
  };
};
