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
            // schema: schema.swagger.items.getAll
        },
        {
            handlerName: "getItemById",
            method: "GET",
            url: '/:id',
            schema: schema.swagger.items.getById
        },
        {
            handlerName: 'updateItemRoom',
            method: 'PUT',
            url: '/:id/room'
        }
    ],
    service: services.Item
})

export default item;