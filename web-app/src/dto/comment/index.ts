import { z } from 'zod';

export const CommentItemSchema = z.object({
    id: z.string(),
    content: z.string(),
    date: z.string()
});

export type CommentItemDTO = z.infer<typeof CommentItemSchema>;
