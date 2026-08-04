import { z } from "zod";
import { ComplaintCategory, ComplaintStatus } from "./complain.constant.js";

export const submitComplainSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(5000),
  category: z.enum(Object.values(ComplaintCategory)).optional(),
  isAnonymous: z.coerce.boolean().optional(),
});

export const updateComplainAdminSchema = z
  .object({
    status: z.enum(Object.values(ComplaintStatus)).optional(),
    adminResponse: z.string().trim().max(5000).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });
