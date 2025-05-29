import zodToJsonSchema from "zod-to-json-schema";
import { ItemSchema } from "..";

const jsonSchema = zodToJsonSchema(ItemSchema, 'Item');
const GetAllItems = jsonSchema.definitions?.Item || jsonSchema;

export const getItems = {
    tags: ['Items'],
    description: "Get all items",
    response : {
        200:  {
            description: 'Successfull response',
            type: 'array',
            items: GetAllItems
        }
    }
}