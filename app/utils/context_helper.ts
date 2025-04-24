import { HttpContext } from '@adonisjs/core/http'

export default class ContextHelper {
    public static get(): HttpContext {
        return HttpContext.getOrFail()
    }
}
