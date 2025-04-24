import CustomModel from '#models/utils/custom_model'
import { column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import { hasOneMedia, type OneMediaRelationType } from '#modules/media/mixins/relation.js'

export default class Project extends CustomModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare title: string

    @column()
    declare description: string

    @column()
    declare googlePlay: string | null

    @column()
    declare appStore: string | null

    @column()
    declare live: string | null

    @column()
    declare priority: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null

    @hasOneMedia()
    declare image: OneMediaRelationType
}
