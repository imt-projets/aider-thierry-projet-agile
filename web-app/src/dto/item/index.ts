import { z } from "zod";
import { RoomSchema } from "../structure";

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
	state: z.string(),
	serialNumber: z.string(),
	orderNumber: z.string(),
	room: RoomSchema.nullable().optional()
});

export const ItemsSchema = z.array(ItemSchema)

export const ItemsPaginationSchema = z.object({
    items:  z.array(ItemSchema),
    count: z.number()
});


export const ItemsStatisticsSchema = z.object({
    ok: z.number(),
    no_rooms: z.number()
});

export type ItemDTO = z.infer<typeof ItemSchema>;
export type ItemsPaginationDTO = z.infer<typeof ItemsPaginationSchema>;
export type ItemsStatisticsDTO = z.infer<typeof ItemsStatisticsSchema>;