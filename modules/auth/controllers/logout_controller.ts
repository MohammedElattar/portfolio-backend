import LogoutUser from '../actions/logout_user.js'
import { okResponse } from '../../../app/utils/http_response.js'
import { translateWord } from '../../../app/utils/translator.js'

export default class LogoutController {
    async handle() {
        await LogoutUser.handle()

        return okResponse({
            message: translateWord('user_logged_out'),
        })
    }
}
