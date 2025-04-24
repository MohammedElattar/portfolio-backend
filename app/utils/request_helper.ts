import ContextHelper from './context_helper.js'

export default class RequestHelper {
    public static get() {
        return ContextHelper.get().request
    }

    public static body() {
        return this.get().body()
    }

    public static qs() {
        return this.get().qs()
    }

    public static params() {
        return this.get().params()
    }

    public static param(id: string) {
        return this.get().param(id)
    }
    public static all() {
        return { ...this.get().all(), ...this.get().allFiles() }
    }

    public static files() {
        return this.get().allFiles()
    }

    public static input(key: string, defaultValue?: any) {
        return this.get().input(key, defaultValue)
    }
}

export const request = RequestHelper
