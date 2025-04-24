import UserContextHelper from '../utils/user_context_helper.js'
import AccessTokenModel from '../models/access_token_model.js'

export default class LogoutUser {
    public static async handle() {
        await AccessTokenModel.query().where('tokenable_id', UserContextHelper.id()).delete()
    }
}
