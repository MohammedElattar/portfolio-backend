import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
    protected tableName = 'media'

    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.morphs('model')
            table.string('name')
            table.string('file_name')
            table.string('path')
            table.bigInteger('size').unsigned().comment('bytes')
            table.string('collection_name').defaultTo('media')
            table.string('disk')
            table.timestamp('created_at')
            table.timestamp('updated_at')
        })
    }

    async down() {
        this.schema.dropTable(this.tableName)
    }
}
