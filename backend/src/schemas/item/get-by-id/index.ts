import zodToJsonSchema from "zod-to-json-schema";
import { ItemSchema } from "../item.schema";
import { defaultErrorSchema } from "@/schemas/core";
import { successResponseSchema } from "@/schemas/core/response.schema";

const wrappedItemSchema = successResponseSchema(ItemSchema);
const jsonSchema = zodToJsonSchema(wrappedItemSchema, 'SuccessResponse');
const schema = jsonSchema.definitions?.SuccessResponse || jsonSchema;

const getItemById = {
    tags: ['Items'],
    description: "Get item by id",
    response : {
        200:  {
            description: 'Successful response',
            ...schema
        },
        400: {
            description : 'Bad Request',
            ...defaultErrorSchema
        },
        404: {
            description : 'Item not found',
            ...defaultErrorSchema
        },
        500: {
            description : 'Internal Server Error',
            ...defaultErrorSchema
        }
    }
}

console.log(getItemById.response)
export { getItemById };