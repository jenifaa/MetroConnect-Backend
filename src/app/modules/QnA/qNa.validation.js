import { z } from "zod";
import { QnaCategory } from "./qNa.model.js";

const tagsSchema = z
  .array(z.string().trim().toLowerCase().min(1).max(30))
  .max(5);

export const createQuestionSchema = z
  .object({
    title: z.string().trim().min(5).max(200),
    description: z.string().trim().min(15).max(5000),
    category: z.enum(Object.values(QnaCategory)).optional(),
    tags: tagsSchema.optional(),
  })
  .strict();

export const updateQuestionSchema = z
  .object({
    title: z.string().trim().min(5).max(200).optional(),
    description: z.string().trim().min(15).max(5000).optional(),
    category: z.enum(Object.values(QnaCategory)).optional(),
    tags: tagsSchema.optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });

export const solvedSchema = z
  .object({
    isSolved: z.boolean(),
  })
  .strict();

export const addCommentSchema = z
  .object({
    content: z.string().trim().min(1).max(1000),
  })
  .strict();
