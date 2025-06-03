import fp from 'fastify-plugin'
import swagger, {FastifySwaggerOptions} from '@fastify/swagger'

export default fp<FastifySwaggerOptions>(async (fastify) => {
    fastify.register(swagger, {
        openapi: {
            info: {
                title: "Aider Thierry API",
                version: "1.0.0"
            }
        },
    })
});