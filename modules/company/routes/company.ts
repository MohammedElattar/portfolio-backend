import router from '@adonisjs/core/services/router'

router
    .group(() => {
        router.get('/', function () {
            return 'You are in company module!'
        })
    })
    .prefix('api/company')
