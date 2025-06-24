import { getItemById, getItems, ItemSchema, } from "./item";

export default {
    swagger : {
        items : {
            getAll : getItems,
            getById: getItemById
        }
    },
    schemas : {
        items : {
            getAll: ItemSchema,
            getById: ItemSchema
        }
    }
}