import CustomModel from '#models/utils/custom_model'
import { belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Company from '#modules/company/models/company.js'

export default class Experience extends CustomModel {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare title: string

    @column()
    declare companyId: number | string

    @column()
    declare priority: number | string

    @column()
    declare description: string

    @column.dateTime()
    declare startDate: DateTime

    @column.dateTime()
    declare endDate: DateTime | null

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null

    @belongsTo(() => Company)
    declare company: BelongsTo<typeof Company>
}
