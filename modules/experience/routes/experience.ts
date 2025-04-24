import router from '@adonisjs/core/services/router'
import AuthMiddlewareHelper from '#modules/auth/utils/auth_middleware_helper.js'

const AdminExperienceMiddleware = () =>
    import('#modules/experience/controllers/admin_experiences_controller.js')
router
    .group(() => {
        router.get('', [AdminExperienceMiddleware, 'index'])
        router.post('', [AdminExperienceMiddleware, 'store'])
        router.put(':id', [AdminExperienceMiddleware, 'update'])
        router.delete(':id', [AdminExperienceMiddleware, 'destroy'])
    })
    .use(AuthMiddlewareHelper.adminMiddlewares())
    .prefix('api/admin/experiences')
