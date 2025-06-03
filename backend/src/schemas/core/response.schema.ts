import { z } from "zod";

export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    status: z.literal("success"),
    data: dataSchema,
  });
}
