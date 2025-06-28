import { ItemSchema } from '@/dto';
import { z } from 'zod';

export const ItemFormSchema = z.object({
    item: ItemSchema.omit({ id: true, room: true }),
    properties: z.object({
        nb_occurance: z.number()
    })
});

export type ItemFormValues = z.infer<typeof ItemFormSchema>;