import "reflect-metadata"
import { environment, DatabaseConfiguration } from "@/config";
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import AutoLoad from '@fastify/autoload';
import { join } from "path";

const initializeApi = async () => {

    const { port } = environment;

    const orm = 
        await DatabaseConfiguration.initializeDatabaseFromEnvironmentVariables(
            environment
        );

    const fastify = Fastify();

    fastify.decorate('orm', orm);

    await fastify.register(fastifyCors, {
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        credentials: true
    });

    await fastify.register(AutoLoad, {
        dir: join(__dirname, 'routes'),
    });

    await fastify.listen({
        port,
        host: '0.0.0.0',
    });

    console.log(
        `\x1b[36m🚀 Server is running at http://localhost:${port}\x1b[0m`,
    );
}

initializeApi();