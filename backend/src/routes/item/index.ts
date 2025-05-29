import { services } from "@/services";
import { entities } from "@/entities";
import { createRouterConfig } from "@/helpers";
import schema from "@/schemas/schema";

const item = createRouterConfig({
    entity: entities.Item,
    routes: [
        {
            handlerName: "getItems",
            method: "GET",
            url: '',
            schema: schema.swagger.items.getAll
        },
        {
            handlerName: "getItemById",
            method: "GET",
            url: '/:id',
            schema: schema.swagger.items.getById
        }
    ],
    service: services.Item
})

export default item;