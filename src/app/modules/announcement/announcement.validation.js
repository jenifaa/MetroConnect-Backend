import { z } from "zod";

export const createAnnouncementSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(10000),
});

export const updateAnnouncementSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(10000).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });
