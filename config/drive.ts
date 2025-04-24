import env from '#start/env'
import app from '@adonisjs/core/services/app'
import { defineConfig, services } from '@adonisjs/drive'

export type DriveDiskType = 'fs'
export const defaultDriveDisk: DriveDiskType = env.get('DRIVE_DISK')
const driveConfig = defineConfig({
    default: defaultDriveDisk,

    /**
     * The services object can be used to configure multiple file system
     * services each using the same or a different driver.
     */
    services: {
        fs: services.fs({
            location: app.makePath('storage'),
            serveFiles: true,
            routeBasePath: '/storage',
            visibility: 'public',
        }),
    },
})

export default driveConfig

declare module '@adonisjs/drive/types' {
    export interface DriveDisks extends InferDriveDisks<typeof driveConfig> {}
}
