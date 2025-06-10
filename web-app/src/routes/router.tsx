import type { RouteObject } from "react-router-dom";
import Home from "@/pages/home/page";
import Items from "@/pages/items/page";
import { InventoryToConfirm } from "@/pages/inventory";

const routes: RouteObject[] = [
    {
        path: '/',
        Component: Home
    },
    {
        path: '/items',
        Component: Items
    },
    {
        path: '/inventory-confirmation',
        Component: InventoryToConfirm
    }
]

export default routes;