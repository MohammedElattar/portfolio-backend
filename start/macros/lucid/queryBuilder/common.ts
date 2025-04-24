import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import db from '@adonisjs/lucid/services/db'

declare module '@adonisjs/lucid/types/model' {
    interface ModelQueryBuilderContract<
        Model extends LucidModel,
        Result extends InstanceType<Model> = InstanceType<Model>,
    > {
        /**
         * Pluck a single column as an array of values
         */
        pluck<K extends keyof Result>(column: K): Promise<Result[K][]>
        insert(values: Record<string, any>[]): Promise<any[]>
    }
}

declare module '@adonisjs/lucid/orm' {
    interface ModelQueryBuilder {
        pluck(column: string): Promise<any[]>
        insert(values: Record<string, any>[]): Promise<any[]>
    }
}

ModelQueryBuilder.macro('pluck', async function (this: ModelQueryBuilder, column: string) {
    const rows = await this.exec()

    return rows.map((row) => row[column])
})

ModelQueryBuilder.macro('insert', async function (this: ModelQueryBuilder, values: any) {
    return Promise.resolve(db.table(this.model.table).multiInsert(values))
})
