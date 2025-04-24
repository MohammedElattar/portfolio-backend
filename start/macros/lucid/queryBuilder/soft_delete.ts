import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import { SOFT_DELETE_SCOPE } from '../../../../app/mixins/with_soft_delete.js'

declare module '@adonisjs/lucid/types/model' {
    interface ModelQueryBuilderContract<
        Model extends LucidModel,
        Result extends InstanceType<Model> = InstanceType<Model>,
    > {
        withTrashed(): this
        onlyTrashed(): this
    }
}

declare module '@adonisjs/lucid/orm' {
    interface ModelQueryBuilder {
        withTrashed(): this
        onlyTrashed(): this
    }
}

ModelQueryBuilder.macro('withTrashed', function (this: ModelQueryBuilder) {
    return (
        this.withoutGlobalScope(SOFT_DELETE_SCOPE)
            // @ts-ignore
            .whereNotNull(`${this.model.table}.${this.model.deletedColumn ?? 'deleted_at'}`)
    )
})

ModelQueryBuilder.macro('onlyTrashed', function (this: ModelQueryBuilder) {
    return (
        this.withoutGlobalScope(SOFT_DELETE_SCOPE)
            // @ts-ignore
            .whereNotNull(`${this.model.table}.${this.model.deletedColumn ?? 'deleted_at'}`)
    )
})
