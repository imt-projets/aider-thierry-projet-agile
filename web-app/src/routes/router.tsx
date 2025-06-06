import type { RouteObject } from "react-router-dom";
import Home from "@/pages/home/page";
import Items from "@/pages/items/page";

const routes: RouteObject[] = [
    {
        path: '/',
        Component: Home
    },
    {
        path: '/items',
        Component: Items
    }
]

export default routes;