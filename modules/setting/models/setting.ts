import CustomModel from '#models/utils/custom_model'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class Setting extends CustomModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare headline: string

    @column()
    declare email: string

    @column()
    declare github: string

    @column()
    declare linkedin: string

    @column()
    declare whatsapp: string

    @column()
    declare resumeUrl: string

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null
}
