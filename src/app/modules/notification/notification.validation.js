import { z } from "zod";

export const markNotificationsReadSchema = z.object({
  notificationIds: z.array(z.string()).optional(),
  markAll: z.boolean().optional(),
});
