import { z } from "zod";

// TODO: Add ItemType, Comments, ...
export const ItemSchema = z.object({
	id: z.string(),
	name: z.string(),
	inventoryNumber: z.string(),
	brand: z.string(),
	model: z.string(),
	description: z.string(),
	warrantyEndDate: z.string(),
	endOfLifeDate: z.string(),
	price: z.number(),
	state: z.string()
});

export type ItemDTO = z.infer<typeof ItemSchema>;