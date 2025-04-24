import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'experiences'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.string('title')
            table.foreignId('company_id')
            table.date('start_date')
            table.date('end_date').nullable()
            table.text('description')
            table.increments('priority', { primaryKey: false })
            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
