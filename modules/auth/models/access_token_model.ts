import CustomModel from '#models/utils/custom_model'
import { column } from '@adonisjs/lucid/orm'

export default class AccessTokenModel extends CustomModel {
    public static table = 'auth_access_tokens'

    @column({ isPrimary: true })
    declare id: number
}
