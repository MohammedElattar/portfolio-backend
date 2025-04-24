import router from '@adonisjs/core/services/router'
import AuthMiddlewareHelper from '#modules/auth/utils/auth_middleware_helper.js'
const AdminSkillsController = () => import('#modules/skill/controllers/admin_skills_controller.js')

router
    .group(() => {
        router.get('', [AdminSkillsController, 'index'])
        router.post('', [AdminSkillsController, 'store'])
        router.put(':id', [AdminSkillsController, 'update'])
        router.delete(':id', [AdminSkillsController, 'destroy'])
    })
    .use(AuthMiddlewareHelper.adminMiddlewares())
    .prefix('api/admin/skills')
