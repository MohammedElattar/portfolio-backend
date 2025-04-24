import router from '@adonisjs/core/services/router'
import AuthMiddlewareHelper from '#modules/auth/utils/auth_middleware_helper.js'
const AdminSettingsController = () =>
    import('#modules/setting/controllers/admin_settings_controller.js')

router
    .group(() => {
        router.get('', [AdminSettingsController, 'show'])
        router.put('', [AdminSettingsController, 'update'])
    })
    .use(AuthMiddlewareHelper.adminMiddlewares())
    .prefix('api/admin/settings')
