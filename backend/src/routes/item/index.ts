import { services } from "@/services";
import { entities } from "@/entities";
import { createRouterConfig } from "@/helpers";

const item = createRouterConfig({
    entity: entities.Item,
    routes: [
        {
            handlerName: "getItems",
            method: "GET",
            url: ''
        },
        {
            handlerName: "getItemById",
            method: "GET",
            url: '/:id'
        }
    ],
    service: services.Item
})

export default item;