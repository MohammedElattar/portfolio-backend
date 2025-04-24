import router from '@adonisjs/core/services/router'
import AuthMiddlewareHelper from '../utils/auth_middleware_helper.js'

const LoginController = () => import('../controllers/login_controller.js')
const LogoutController = () => import('../controllers/logout_controller.js')

router
    .group(() => {
        // Login
        router
            .group(() => {
                router.post('dashboard', [LoginController, 'dashboard'])
            })
            .prefix('login')

        // Register
        router
            .group(() => {
                router.post('logout', [LogoutController, 'handle'])
            })
            .use(AuthMiddlewareHelper.defaultMiddlewares())
    })
    .prefix('api/auth')
