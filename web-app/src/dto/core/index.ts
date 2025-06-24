import { z } from "zod";

export const IdentityFieldsSchema = z.object({
    id: z.string(),
    name: z.string(),
});