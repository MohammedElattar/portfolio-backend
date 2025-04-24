import { defineConfig } from '@adonisjs/core/app'
import { loadModuleProviders, loadModuleRoutes } from '#modules/base/importer.js'

export default defineConfig({
    /*
|--------------------------------------------------------------------------
| Commands
|--------------------------------------------------------------------------
|
| List of ace commands to register from packages. The application commands
| will be scanned automatically from the "./commands" directory.
|
*/
    commands: [
        () => import('@adonisjs/core/commands'),
        () => import('@adonisjs/lucid/commands'),
        () => import('adonisjs-modules/commands'),
    ],

    /*
|--------------------------------------------------------------------------
| Service providers
|--------------------------------------------------------------------------
|
| List of service providers to import and register when booting the
| application
|
*/
    providers: [
        () => import('@adonisjs/core/providers/app_provider'),
        () => import('@adonisjs/core/providers/hash_provider'),
        {
            file: () => import('@adonisjs/core/providers/repl_provider'),
            environment: ['repl', 'test'],
        },
        () => import('@adonisjs/core/providers/vinejs_provider'),
        () => import('@adonisjs/cors/cors_provider'),
        () => import('@adonisjs/lucid/database_provider'),
        () => import('@adonisjs/auth/auth_provider'),
        () => import('#providers/vine_custom_provider'),
        ...loadModuleProviders(),
        () => import('@adonisjs/i18n/i18n_provider'),
        () => import('@adonisjs/drive/drive_provider'),
        () => import('adonis-lucid-soft-deletes/provider'),
    ],

    /*
|--------------------------------------------------------------------------
| Preloads
|--------------------------------------------------------------------------
|
| List of modules to import before starting the application.
|
*/
    preloads: [
        () => import('#start/routes'),
        () => import('#start/kernel'),
        ...loadModuleRoutes(),
        () => import('#start/macros/lucid/queryBuilder/pagination'),
        () => import('#start/macros/lucid/queryBuilder/sorter'),
        () => import('#start/macros/lucid/queryBuilder/searchable'),
        () => import('#start/macros/lucid/queryBuilder/finder'),
        () => import('#start/macros/lucid/queryBuilder/common'),
        () => import('#start/ws'),
        () => import('#start/macros/vine/schema'),
        () => import('#start/macros/lucid/knex/schema'),
        () => import('#start/macros/lucid/queryBuilder/global_scope'),
        () => import('#start/macros/lucid/queryBuilder/soft_delete'),
        () => import('#start/macros/lucid/queryBuilder/aggregates'),
    ],

    /*
|--------------------------------------------------------------------------
| Tests
|--------------------------------------------------------------------------
|
| List of test suites to organize tests by their type. Feel free to remove
| and add additional suites.
|
*/
    tests: {
        suites: [
            {
                files: ['tests/unit/**/*.spec(.ts|.js)'],
                name: 'unit',
                timeout: 2000,
            },
            {
                files: ['tests/functional/**/*.spec(.ts|.js)'],
                name: 'functional',
                timeout: 30000,
            },
        ],
        forceExit: false,
    },
    metaFiles: [
        {
            pattern: 'resources/lang/**/*.{json,yaml,yml}',
            reloadServer: false,
        },
        {
            pattern: '.env',
            reloadServer: false,
        },
    ],
})
