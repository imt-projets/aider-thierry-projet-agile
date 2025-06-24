import { z } from "zod";

export const RoomSchema = z.object({
    id: z.string(),
    name: z.string(),
    type: z.string()
})