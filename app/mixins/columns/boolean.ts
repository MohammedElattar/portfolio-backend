import { column } from '@adonisjs/lucid/orm'
import type { ColumnOptions } from '@adonisjs/lucid/types/model'

export function booleanColumn(options?: Partial<ColumnOptions>) {
    return column({
        consume: (value) => !!value,
        prepare: (value) => !!value,
        ...options,
    })
}
