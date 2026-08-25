import { z } from "zod";

export const accessRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  business: z.string().trim().min(1).max(180),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(8).max(5000),
  locale: z.enum(["FR", "EN"]).default("FR"),
  website: z.string().max(0).optional(),
});
