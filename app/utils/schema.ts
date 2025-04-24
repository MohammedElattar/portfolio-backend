import db from '@adonisjs/lucid/services/db'

export const attachSpatialIndex = (table: string, column: string = 'location') => {
    db.raw(`CREATE SPATIAL INDEX ${column}_index ON ${table} (${column});`)
}
