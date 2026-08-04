import { z } from "zod";
import { LostFoundStatus, LostFoundType } from "./lostFound.constant.js";

export const createLostFoundSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(3000),
  type: z.enum(Object.values(LostFoundType)),
  location: z.string().trim().min(1).max(300),
  contactInfo: z.string().trim().min(1).max(300),
});

export const updateLostFoundSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(3000).optional(),
    location: z.string().trim().min(1).max(300).optional(),
    contactInfo: z.string().trim().min(1).max(300).optional(),
    status: z.enum(Object.values(LostFoundStatus)).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });
