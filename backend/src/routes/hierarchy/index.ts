import { services } from "@/services";
import { entities } from "@/entities";
import { createRouterConfig } from "@/helpers";

const hierarchy = createRouterConfig({
    entity: entities.Structure,
    routes: [
        {
            handlerName: "getHierarchy",
            method: "GET",
            url: ''
        }
    ],
    service: services.Hierarchy
})

export default hierarchy