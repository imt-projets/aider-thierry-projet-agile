import { services } from "@/services";
import { entities } from "@/entities";
import { createRouterConfig } from "@/helpers";

const user = createRouterConfig({
    entity: entities.User,
    routes: [
        {
            handlerName: "getUsers",
            method: "GET",
            url: ""
        },
        {
            handlerName: "getUserById",
            method: "GET",
            url: "/:id"
        },
        {
            handlerName: "createUser",
            method: "POST",
            url: ""
        },
        {
            handlerName: "updateUser",
            method: "PUT",
            url: "/:id"
        },
        {
            handlerName: "deleteUser",
            method: "DELETE",
            url: "/:id"
        }
    ],
    service: services.User
})

export default user;
