import { services } from "@/services";
import { entities } from "@/entities";
import { createRouterConfig } from "@/helpers";

const hierarchy = createRouterConfig({
    entity: entities.InventoryToConfirm,
    extraRepositories: {
        item: entities.Item,
        structure: entities.Structure
    },
    routes: [
        {
            handlerName: "getAllInventoryToConfirm",
            method: "GET",
            url: ''
        },
        {
            handlerName: "createInventoryToConfirm",
            method: "POST",
            url: ''
        },
        {
            handlerName: "deleteInventoryToConfirm",
            method: "DELETE",
            url: '/:id'
        },
        {
            handlerName: "validateInventoryToConfirm",
            method: "POST",
            url: '/:id/validate'
        }
    ],
    service: services.InventoryToConfirm
})

export default hierarchy