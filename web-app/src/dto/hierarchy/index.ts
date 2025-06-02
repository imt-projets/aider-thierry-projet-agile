import { z } from "zod";
import { IdentityFieldsSchema } from "../core";

export const TreeViewItemSchema = IdentityFieldsSchema.extend({
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

export type TreeViewDTO = z.infer<typeof TreeViewSchema>;