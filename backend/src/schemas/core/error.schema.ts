import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export const ErrorResponseSchema = z.object({
    message: z.string(),
});

export const defaultErrorJsonSchema = zodToJsonSchema(ErrorResponseSchema, 'ErrorResponse');
export const defaultErrorSchema = defaultErrorJsonSchema.definitions?.ErrorResponse || defaultErrorJsonSchema;