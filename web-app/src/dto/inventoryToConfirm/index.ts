import { z } from "zod";

export const InventoryMappingSchema = z.object({
  itemType: z.string(),
  itemsList: z.array(z.string()).optional(),
  removedItem: z.array(z.string()).optional(),
  newRoom: z.string().optional(),
  newRoomName: z.string().optional(),
});

export const InventoryToConfirmSchema = z.object({
  id: z.string(),
  type: z.enum(['INVENTAIRE_SALLE', 'MOVE_ITEM']),
  room: z.string(),
  roomName:z.string(),
  date: z.string(),
  mapping: z.array(InventoryMappingSchema)
});

export type InventoryMappingDTO = z.infer<typeof InventoryMappingSchema>;
export type InventoryToConfirmDTO = z.infer<typeof InventoryToConfirmSchema>;