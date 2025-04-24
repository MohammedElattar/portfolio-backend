import { JSONAPIErrorReporter } from '#exceptions/reporter_exception'
import type { ApplicationService } from '@adonisjs/core/types'
import vine from '@vinejs/vine'

export default class VineCustomProvider {
    constructor(protected app: ApplicationService) {}

    /**
     * Register bindings to the container
     */
    register() {
        vine.errorReporter = () => new JSONAPIErrorReporter()
    }
}
