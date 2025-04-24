import router from '@adonisjs/core/services/router'

const UploadController = () => import('#modules/media/controllers/file_uploader_controller.js')

router.post('api/image_upload', [UploadController, 'handle'])
