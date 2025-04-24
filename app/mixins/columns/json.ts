import { column } from '@adonisjs/lucid/orm'
import type { ColumnOptions } from '@adonisjs/lucid/types/model'

export function json(options?: Partial<ColumnOptions>) {
    return column({
        consume: (value) => (typeof value === 'string' ? JSON.parse(value) : value),
        prepare: (value) => JSON.stringify(value),
        ...options,
    })
}
