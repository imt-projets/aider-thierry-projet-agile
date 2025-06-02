import zodToJsonSchema from "zod-to-json-schema";
import { ItemSchema } from "..";
import { successResponseSchema } from "@/schemas/core/response.schema";
import z from 'zod';
import { defaultErrorSchema } from "@/schemas/core";

const wrappedItemSchema = successResponseSchema(z.array(ItemSchema));
const jsonSchema = zodToJsonSchema(wrappedItemSchema, 'SuccessResponse');
const GetAllItems = jsonSchema.definitions?.SuccessResponse || jsonSchema;

const getItems = {
    tags: ['Items'],
    description: "Get all items",
    response : {
        200:  {
            description: 'Successfull response',
            ...GetAllItems
        },
        500: {
            description : 'Internal Server Error',
            ...defaultErrorSchema
        }
    }
}

export { getItems };