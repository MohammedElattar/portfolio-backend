import { ModelPaginatorContract } from '@adonisjs/lucid/types/model'
import { SimplePaginatorContract } from '@adonisjs/lucid/types/querybuilder'
import { ModelQueryBuilder } from '@adonisjs/lucid/orm'
import RequestHelper from '../../../../app/utils/request_helper.js'

declare module '@adonisjs/lucid/types/model' {
    interface ModelQueryBuilderContract<Model extends LucidModel, Result = InstanceType<Model>> {
        paginatedCollection(): Promise<
            Result extends LucidRow
                ? ModelPaginatorContract<Result>
                : SimplePaginatorContract<Result>
        >
    }
}

declare module '@adonisjs/lucid/orm' {
    interface ModelQueryBuilder {
        paginatedCollection(): Promise<ModelPaginatorContract<any>>
    }
}

ModelQueryBuilder.macro('paginatedCollection', function (this: ModelQueryBuilder) {
    let perPage = +RequestHelper.get().qs().per_page
    let page = +RequestHelper.get().qs().page

    if (!Number.isInteger(perPage) || perPage > 100 || perPage < 5) {
        perPage = 10
    }

    if (!Number.isInteger(page) || page < 1) {
        page = 1
    }

    return this.paginate(page, perPage)
})
