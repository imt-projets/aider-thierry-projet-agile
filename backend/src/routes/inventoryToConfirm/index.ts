import { services } from "@/services";
import { entities } from "@/entities";
import { createRouterConfig } from "@/helpers";

const hierarchy = createRouterConfig({
    entity: entities.InventoryToConfirm,
    routes: [
        {
            handlerName: "getAllInventoryToConfirm",
            method: "GET",
            url: ''
        }
    ],
    service: services.InventoryToConfirm
})

export default hierarchy