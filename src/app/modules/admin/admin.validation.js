import { z } from "zod";
import { Role } from "../user/user.model.js";

export const updateAdminUserSchema = z
  .object({
    status: z.enum(["active", "suspended"]).optional(),
    role: z.enum(Object.values(Role)).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required to update",
  });
