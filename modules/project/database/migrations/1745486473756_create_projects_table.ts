import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'projects'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('title')
            table.text('description')
            table.string('google_play').nullable()
            table.string('app_store').nullable()
            table.string('live').nullable()
            table.increments('priority', { primaryKey: false })
            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
