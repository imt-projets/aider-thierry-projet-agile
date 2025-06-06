import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

// TODO : Add comments, itemType, supplier and rooms
export const ItemSchema = z.object({
    id : z.string(),
    name: z.string(),
    serialNumber: z.string(),
    inventoryNumber: z.string(),
    orderNumber: z.string(),
    price: z.number(),
    description: z.string(),
    warrantyEndDate: z.string().transform(str => new Date(str)),
    endOfLifeDate: z.string().transform(str => new Date(str)),
    brand: z.string(),
    model: z.string(),
    state: z.string()
})