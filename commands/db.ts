import { BaseCommand } from '@adonisjs/core/ace'
import { spawn } from 'child_process'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import env from '#start/env'

export default class Db extends BaseCommand {
    static commandName = 'db'
    static description = 'Launch MySQL interactive shell'
    static options: CommandOptions = {}

    public async run() {
        const user = env.get('DB_USER')
        const host = env.get('DB_HOST')
        const password = env.get('DB_PASSWORD')
        const db = env.get('DB_DATABASE')

        const mysqlCommand = 'mysql'
        const args = ['-u', user, `-p${password}`, '-h', host, db]
        const mysqlProcess = spawn(mysqlCommand, args, { stdio: 'inherit' })

        mysqlProcess.on('close', (code) => {
            if (code !== 0) {
                this.logger.error(`MySQL shell exited with code ${code}`)
            }
        })
    }
}
