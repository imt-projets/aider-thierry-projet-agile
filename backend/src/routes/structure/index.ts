import { services } from "@/services";
import { entities } from "@/entities";
import { createRouterConfig } from "@/helpers";

const structure = createRouterConfig({
    entity: entities.Structure,
    routes: [
        {
            handlerName: "getSchools",
            method: "GET",
            url: '/schools'
        },
    ],
    service: services.Structure
})

export default structure;