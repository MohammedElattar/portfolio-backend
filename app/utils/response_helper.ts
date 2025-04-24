import ContextHelper from './context_helper.js'

export default class ResponseHelper {
    static get() {
        return ContextHelper.get().response
    }
}
