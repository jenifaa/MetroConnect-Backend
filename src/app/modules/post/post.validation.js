import { z } from "zod";
import { PostCategory, ReactionType } from "./post.constant.js";

export const createPostSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  category: z.enum(Object.values(PostCategory)).optional(),
  isAnonymous: z.coerce.boolean().optional(),
});

export const updatePostSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    category: z.enum(Object.values(PostCategory)).optional(),
    isAnonymous: z.coerce.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });

export const reactPostSchema = z.object({
  reactionType: z.enum(Object.values(ReactionType)),
});

export const commentPostSchema = z.object({
  text: z.string().trim().min(1).max(2000),
});
