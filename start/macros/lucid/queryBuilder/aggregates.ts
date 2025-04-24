import { ModelQueryBuilder } from '@adonisjs/lucid/orm'

declare module '@adonisjs/lucid/types/model' {
    interface ModelQueryBuilderContract<
        Model extends LucidModel,
        Result extends InstanceType<Model> = InstanceType<Model>,
    > {
        withSum(relationName: string, column: string, userCallback?: (query: any) => void): this

        withAvg(relationName: string, column: string, userCallback?: (query: any) => void): this

        withMin(relationName: string, column: string, userCallback?: (query: any) => void): this

        withMax(relationName: string, column: string, userCallback?: (query: any) => void): this
    }
}

declare module '@adonisjs/lucid/orm' {
    interface ModelQueryBuilder {
        withSum(relationName: string, column: string, userCallback?: (query: any) => void): this

        withAvg(relationName: string, column: string, userCallback?: (query: any) => void): this

        withMin(relationName: string, column: string, userCallback?: (query: any) => void): this

        withMax(relationName: string, column: string, userCallback?: (query: any) => void): this
    }
}

function registerAggregateMacro(methodName: 'sum' | 'avg' | 'min' | 'max', macroName?: string) {
    const name = macroName ?? `with${methodName.charAt(0).toUpperCase()}${methodName.slice(1)}`

    ModelQueryBuilder.macro(
        name as keyof ModelQueryBuilder,
        function (
            this: ModelQueryBuilder,
            relationName: string,
            column: string,
            userCallback?: (query: any) => void
        ) {
            this.withAggregate(relationName, (subQuery: any) => {
                userCallback?.(subQuery)

                if (!subQuery.hasAggregates) {
                    subQuery[methodName](column)
                }

                if (!subQuery.subQueryAlias) {
                    subQuery.as(`${relationName}_${methodName}`)
                }
            })

            return this
        }
    )
}

registerAggregateMacro('sum')
registerAggregateMacro('avg')
registerAggregateMacro('min')
registerAggregateMacro('max')
