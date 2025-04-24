import { Authenticable } from '../types/auth_types.js'
import ContextHelper from '../../../app/utils/context_helper.js'

export default class UserContextHelper {
    public static get() {
        return ContextHelper.get().auth
    }

    public static getUserOrFail(): Authenticable {
        return this.get().getUserOrFail()
    }

    public static user(): Authenticable {
        return this.get().getUserOrFail()
    }

    public static id() {
        return this.user().id
    }

    public static optionalUserId() {
        try {
            return this.user().id
        } catch (Error) {
            return null
        }
    }

    public static check() {
        return this.get().check()
    }
}
