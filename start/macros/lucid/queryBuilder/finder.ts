ModelQueryBuilder.macro('exists', async function (this: ModelQueryBuilder) {
    return !!(await this.first())
})

import { ModelQueryBuilder } from '@adonisjs/lucid/orm'

declare module '@adonisjs/lucid/types/model' {
    interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
        find(value: string | number): Promise<InstanceType<Model> | null>
        findOrFail(value: string | number): Promise<InstanceType<Model>>
        exists(): Promise<boolean>
    }
}

declare module '@adonisjs/lucid/orm' {
    interface ModelQueryBuilder {
        find(value: string | number): any
        findOrFail(value: string | number): any
        exists(): Promise<boolean>
    }
}

// Custom Sorting
ModelQueryBuilder.macro('find', function (this: ModelQueryBuilder, value: string | number) {
    return this.where(this.model.primaryKey, value).first()
})
ModelQueryBuilder.macro('findOrFail', function (this: ModelQueryBuilder, value: string | number) {
    return this.where(this.model.primaryKey, value).firstOrFail()
})
