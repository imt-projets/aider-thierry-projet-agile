import { services } from "@/services";
import { entities } from "@/entities";
import { createRouterConfig } from "@/helpers";

const structure = createRouterConfig({
  entity: entities.Structure,
  service: services.Structure,
  extraRepositories: {
    item: entities.Item
  },
  routes: [
    {
      handlerName: "getSchools",
      method: "GET",
      url: '/schools'
    },
    {
      handlerName: "getRoomFromInventoryId",
      method: "GET",
      url: '/room/:id'
    },
    {
      handlerName: "editItemsInRoomFromInventoryId",
      method: "PUT",
      url: '/room/:id'
    }
  ]
});


export default structure;