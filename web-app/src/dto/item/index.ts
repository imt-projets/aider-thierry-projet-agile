import { z } from "zod";

// TODO: Add State, ItemType, Comments, ...
export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  inventoryNumber: z.string(),
  brand: z.string(),
  model: z.string(),
  description: z.string(),
  warrantyEndDate: z.string(),
  endOfLifeDate: z.string(),
  price: z.number()
});

export type ItemDTO = z.infer<typeof ItemSchema>;