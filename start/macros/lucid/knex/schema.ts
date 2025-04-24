import knexModule from 'knex'
import type { Knex } from 'knex'

const { TableBuilder } = knexModule

export type ForeignIdOptions = {
    referencedTable?: string
    referencedColumn?: string
    onDelete?: string
    nullable?: boolean
}

TableBuilder.extend(
    'foreignId',
    function (this: Knex.TableBuilder, columnName: string, options: ForeignIdOptions = {}) {
        const defaultOptions = {
            referencedTable: undefined,
            referencedColumn: 'id',
            onDelete: 'CASCADE',
            nullable: false,
        }

        const mergedOptions = { ...defaultOptions, ...options }

        const referencedTable =
            mergedOptions.referencedTable ?? getTableNameFromForeignKey(columnName)
        const referencedColumn = mergedOptions.referencedColumn
        const onDelete = mergedOptions.onDelete
        const nullable = mergedOptions.nullable

        const column = this.integer(columnName).unsigned()

        if (nullable) {
            column.nullable()
        } else {
            column.notNullable()
        }

        column.references(`${referencedTable}.${referencedColumn}`).onDelete(onDelete)
    }
)

TableBuilder.extend('morphs', function (this: Knex.TableBuilder, name: string) {
    const { dbId, dbType } = generateMorphable(name)

    this.integer(dbId).unsigned().notNullable()
    this.string(dbType).notNullable()
})

TableBuilder.extend('uuidMorphs', function (this: Knex.TableBuilder, name: string) {
    const { dbId, dbType } = generateMorphable(name)

    this.string(dbId).notNullable()
    this.string(dbType).notNullable()
})

TableBuilder.extend('softDeletes', function (this: Knex.TableBuilder, columnName?: string) {
    columnName = columnName ?? 'deleted_at'

    this.dateTime(columnName).nullable()
})
import 'knex'
import { generateMorphable } from '#start/macros/lucid/relation/index'
import string from '@adonisjs/core/helpers/string'
declare module 'knex' {
    namespace Knex {
        interface TableBuilder {
            morphs(name: string): this
            uuidMorphs(name: string): this
            foreignId(columnName: string, otherOptions?: ForeignIdOptions): this
            softDeletes(columnName?: string): this
        }
    }
}

export function getTableNameFromForeignKey(foreignKey: string): string {
    if (!foreignKey.endsWith('_id')) {
        throw new Error(`Invalid foreign key format: ${foreignKey}`)
    }

    const name = foreignKey.replace(/_id$/, '')
    return string.pluralize(name)
}
