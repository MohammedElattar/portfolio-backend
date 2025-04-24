import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { column, scope } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { AccessToken, DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { UserTypeEnum } from '#modules/auth/enums/user_type_enum.js'
import { compose } from '@adonisjs/core/helpers'
import CustomModel from './utils/custom_model.js'
import { hasOneMedia, type OneMediaRelationType } from '#modules/media/mixins/relation.js'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
})

export default class User extends compose(CustomModel, AuthFinder) {
    @column({ isPrimary: true })
    declare id: number

    @column()
    declare name: string | null

    @column()
    declare email: string

    @column({ serializeAs: null })
    declare password: string

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    declare updatedAt: DateTime | null

    @column.dateTime()
    declare emailVerifiedAt: DateTime | null

    @column()
    declare status: boolean

    @column()
    declare type: UserTypeEnum

    @hasOneMedia()
    declare avatar: OneMediaRelationType

    // custom properties
    static accessTokens = DbAccessTokensProvider.forModel(User)
    accessToken?: AccessToken

    // Scopes
    static validateLoginType = scope((query, inMobile: boolean) => {
        return (
            query
                // .if(inMobile, (q) => q.where('type', UserTypeEnum.VENDOR))
                .if(!inMobile, (q) => q.where('type', UserTypeEnum.ADMIN))
        )
    })
}
