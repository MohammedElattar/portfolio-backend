import { ModelQueryBuilder } from '@adonisjs/lucid/orm'

declare module '@adonisjs/lucid/types/model' {
    interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
        /**
         * Order by latest value of the given column.
         * Defaults to 'created_at' if no column is provided.
         */
        latest(column?: string): this

        /**
         * Order by oldest value of the given column.
         * Defaults to 'created_at' if no column is provided.
         */
        oldest(column?: string): this
    }
}

declare module '@adonisjs/lucid/orm' {
    interface ModelQueryBuilder {
        latest(column: string): this
        oldest(column: string): this
    }
}

// Custom Sorting
ModelQueryBuilder.macro(
    'latest',
    function (this: ModelQueryBuilder, column: string = 'created_at') {
        return this.orderBy(column || 'created_at', 'desc')
    }
)
ModelQueryBuilder.macro(
    'oldest',
    function (this: ModelQueryBuilder, column: string = 'created_at') {
        return this.orderBy(column, 'asc')
    }
)
