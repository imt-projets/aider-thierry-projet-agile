import { config } from 'dotenv';
import { Interfaces } from '@/interfaces';
import path from 'path';

config({ path: path.resolve(__dirname, '../../../../.env') });

const validateEnv = (): Interfaces.Environment => {
    const requiredVars = [
        'DB_HOST',
        'DB_PORT',
        'DB_NAME',
        'DB_USER',
        'DB_PASSWORD',
        'PORT',
    ] as const;

    const missingVars = requiredVars.filter(key => !process.env[key]);

    if (missingVars.length > 0) {
        throw new Error(
            `The following environment variables are missing: ${missingVars.join(', ')}`,
        );
    }

    return {
        dbHost: process.env.DB_HOST!,
        dbPort: parseInt(process.env.DB_PORT!, 10)!,
        dbName: process.env.DB_NAME!,
        dbUser: process.env.DB_USER!,
        dbPassword: process.env.DB_PASSWORD!,
        port: parseInt(process.env.PORT!, 10)!,
    };
};

const environment = validateEnv();
export { environment, validateEnv };