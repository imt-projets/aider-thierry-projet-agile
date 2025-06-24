import { z } from "zod";
import { IdentityFieldsSchema } from "../core";

export const TreeViewItemSchema = IdentityFieldsSchema.extend({
    inventoryNumber: z.string(),
    serialNumber: z.string()
});

export const TreeViewRoomSchema = IdentityFieldsSchema.extend({
    type: z.string(),
    items: z.array(TreeViewItemSchema),
});

export const TreeViewBuildingSchema = IdentityFieldsSchema.extend({
    type: z.string(),
    children: z.array(TreeViewRoomSchema),
});

export const TreeViewSchoolSchema = IdentityFieldsSchema.extend({
    type: z.string(),
    children: z.array(TreeViewBuildingSchema),
});

export const TreeViewSchema = z.array(TreeViewSchoolSchema);

export type TreeViewItem = z.infer<typeof TreeViewItemSchema>;
export type TreeViewRoom = z.infer<typeof TreeViewRoomSchema>;
export type TreeViewBuilding = z.infer<typeof TreeViewBuildingSchema>;
export type TreeViewSchool = z.infer<typeof TreeViewSchoolSchema>;
export type TreeViewDTO = z.infer<typeof TreeViewSchema>;