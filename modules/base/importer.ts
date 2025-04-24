import {
    existsSync,
    lstatSync,
    mkdirSync,
    readdirSync,
    readlinkSync,
    symlinkSync,
    unlinkSync,
} from 'node:fs'
import { join } from 'node:path'
import app from '@adonisjs/core/services/app'

const modulesPath = app.makePath('modules')

export function loadModuleProviders() {
    return importer('providers')
}

export function loadModulesMigrations() {
    const modulesMigrationsPath = 'modules_migrations'

    if (!existsSync(modulesMigrationsPath)) {
        mkdirSync(modulesMigrationsPath)
    }

    const modules = readdirSync(modulesPath)
    const baseMigrationsPath = app.makePath('database', 'migrations')
    createSMigrationsSymlinks(baseMigrationsPath, modulesMigrationsPath)

    for (const module of modules) {
        const modulePath = join(modulesPath, module)
        const migrationsPath = join(modulePath, 'database', 'migrations')

        createSMigrationsSymlinks(migrationsPath, modulesMigrationsPath)
    }
}
function createSMigrationsSymlinks(migrationsPath: string, modulesMigrationsPath: string) {
    if (existsSync(migrationsPath)) {
        // Read all migration files
        const migrationFiles = readdirSync(migrationsPath)

        for (const migrationFile of migrationFiles) {
            if (migrationFile.endsWith('.ts')) {
                const sourcePath = join(migrationsPath, migrationFile)
                const targetPath = join(modulesMigrationsPath, `${migrationFile}`)

                // Check if symlink exists and is broken
                if (existsSync(targetPath)) {
                    try {
                        readlinkSync(targetPath)
                    } catch (error) {
                        // If symlink is broken, remove it
                        unlinkSync(targetPath)
                    }
                }

                // Create symlink if it doesn't exist
                if (!existsSync(targetPath)) {
                    symlinkSync(sourcePath, targetPath, 'file')
                }
            }
        }
    }
}

export function loadModuleRoutes() {
    return importer('routes')
}

function checkPathExistsSync(path: string): boolean {
    return existsSync(path)
}

function directoryFilesLength(path: string) {
    return readdirSync(path).length
}

const importer = (path: string, importDirectoryOnly: boolean = false) => {
    if (!checkPathExistsSync(modulesPath)) {
        return []
    }

    return readdirSync(modulesPath)
        .filter((module) => {
            const modulePath = join(modulesPath, module)
            return lstatSync(modulePath).isDirectory()
        })
        .flatMap((module) => {
            const finalPath = join(modulesPath, module, path)

            if (!checkPathExistsSync(finalPath) || directoryFilesLength(finalPath) === 0) {
                return []
            }

            if (importDirectoryOnly) {
                return [() => import(`#modules/${module}/${path}`)]
            }

            return readdirSync(finalPath)
                .filter((file) => file.endsWith('.ts') || file.endsWith('.js'))
                .map(
                    (file) => () =>
                        import(`#modules/${module}/${path}/${file.replace('.ts', '.js')}`)
                )
        })
}
