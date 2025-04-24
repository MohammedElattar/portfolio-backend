import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import RequestHelper from '../../../../app/utils/request_helper.js'

type SearchableProps = {
    handleKeyName?: string
    columns?: string[]
    orWhere?: boolean
}
type SearchByForeignKeyProps = {
    column: string
    value?: string
}
declare module '@adonisjs/lucid/types/model' {
    interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
        searchable(props?: Partial<SearchableProps>): this
        searchByForeignKey(props?: SearchByForeignKeyProps): this
    }
}

declare module '@adonisjs/lucid/orm' {
    interface ModelQueryBuilder {
        searchable(props?: Partial<SearchableProps>): this
        searchByForeignKey(props?: SearchByForeignKeyProps): this
    }
}

ModelQueryBuilder.macro(
    'searchByForeignKey',
    function (this: ModelQueryBuilder, props: SearchByForeignKeyProps) {
        const value: string | null | undefined =
            props.value === undefined ? RequestHelper.body()[props.column] : props.value

        if (value === undefined || value === null) return this

        return this.where(props.column, value)
    }
)

ModelQueryBuilder.macro(
    'searchable',
    function (this: ModelQueryBuilder, props: Partial<SearchableProps> = {}) {
        const { columns = ['name'], handleKeyName = 'handle', orWhere = false } = props

        if (!orWhere) {
            return this.where(function (query: ModelQueryBuilder) {
                return searchLogic(query, columns, parseHandle(handleKeyName))
            })
        } else {
            return this.orWhere(function (query: ModelQueryBuilder) {
                return searchLogic(query, columns, parseHandle(handleKeyName))
            })
        }
    }
)

/**
 * Scope to handle search logic
 *
 * @param query - The query builder instance
 * @param searchableKeys - The keys to search
 * @param handle - The search term
 */
const searchLogic = (query: ModelQueryBuilder, searchableKeys: string[], handle?: string) => {
    if (!handle) {
        return query
    }

    let isFirstKey = false
    const table = query.model.table

    searchableKeys.forEach((key) => {
        if (!isFirstKey) {
            query.where(`${table}.${key}`, 'like', `%${handle}%`)
            isFirstKey = true
        } else {
            query.orWhere(`${table}.${key}`, 'like', `%${handle}%`)
        }
    })

    return query
}

const parseHandle = (handleKeyName: string = 'handle') => {
    const handle: string | undefined = RequestHelper.get().qs()[handleKeyName]

    if (typeof handle === 'undefined' || handle === null) {
        return undefined
    }

    return handle
}
