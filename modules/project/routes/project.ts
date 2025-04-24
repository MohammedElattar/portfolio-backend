import router from '@adonisjs/core/services/router'
import AuthMiddlewareHelper from '#modules/auth/utils/auth_middleware_helper.js'
const AdminProjectsController = () =>
    import('#modules/project/controllers/admin_projects_controller.js')

router
    .group(() => {
        router.get('', [AdminProjectsController, 'index'])
        router.post('', [AdminProjectsController, 'store'])
        router.put(':id', [AdminProjectsController, 'update'])
        router.delete(':id', [AdminProjectsController, 'destroy'])
    })
    .use(AuthMiddlewareHelper.adminMiddlewares())
    .prefix('api/admin/projects')
