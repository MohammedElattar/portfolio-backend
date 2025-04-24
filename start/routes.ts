import router from '@adonisjs/core/services/router'
const WebsitesController = () => import('#controllers/websites_controller')

router.get('api/website', [WebsitesController, 'handle'])
