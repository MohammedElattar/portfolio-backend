import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConfig = defineConfig({
    connection: env.get('DB_CONNECTION', 'mysql'),
    prettyPrintDebugQueries: env.get('NODE_ENV', 'development') !== 'production',
    connections: {
        mysql: {
            client: 'mysql2',
            connection: {
                host: env.get('DB_HOST'),
                port: env.get('DB_PORT'),
                user: env.get('DB_USER'),
                password: env.get('DB_PASSWORD'),
                database: env.get('DB_DATABASE'),
            },
            migrations: {
                naturalSort: true,
                paths: [
                    // 'database/migrations',
                    'modules_migrations',
                ],
            },
            seeders: {
                paths: ['database/seeders/main'],
            },
            debug: true,
        },
    },
})

export default dbConfig
