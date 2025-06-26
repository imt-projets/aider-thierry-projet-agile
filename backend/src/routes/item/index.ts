import { services } from "@/services";
import { entities } from "@/entities";
import { createRouterConfig } from "@/helpers";
import schema from "@/schemas/schema";

const item = createRouterConfig({
    entity: entities.Item,
    extraRepositories: {
        structure: entities.Structure
    },
    routes: [
        {
            handlerName: "getItems",
            method: "GET",
            url: '',
            schema: schema.swagger.items.getAll
        },
        {
            handlerName: "getItemsWithRooms",
            method: "GET",
            url: '/room'
        },
        {
            handlerName: "getItemsPaginationTable",
            method: "GET",
            url: '/page/:page'
        },
        {
            handlerName: "getItemById",
            method: "GET",
            url: '/:id',
            schema: schema.swagger.items.getById
        },
        {
            handlerName: "getCommentsByItemId",
            method: "GET",
            url: '/:id/comments',
        },
        {
            handlerName: "getItemByInventoryNumber",
            method: "GET",
            url: '/inventory/:inventoryNumber'
        },
        {
            handlerName: 'updateItemRoomFromInventoryId',
            method: 'PUT',
            url: '/:inventoryNumber/room'
        },
        {
            handlerName: 'createItem',
            method: 'POST',
            url: ''
        },
        {
            handlerName: 'getItemsRoomStats',
            method: 'GET',
            url: '/statistics'
        },
        {
            handlerName: 'updateItem',
            method: 'PUT',
            url: ''
        }
    ],
    service: services.Item
})

export default item;