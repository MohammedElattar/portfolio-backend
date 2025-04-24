import CustomModel from '#models/utils/custom_model'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { hasOneMedia, type OneMediaRelationType } from '#modules/media/mixins/relation.js'

export default class Skill extends CustomModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string

    @column()
    declare priority: number | string

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null

    @hasOneMedia()
    declare image: OneMediaRelationType
}
