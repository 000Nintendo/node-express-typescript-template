import { Router } from 'express'
import uploadController from '../controllers/upload.controller'
import { authenticateRequests } from '../middlewares/authenticateRequest.middleware'

const multer = require('multer')
const file = multer({ dest: 'src/uploads/' })
const router = Router()

router.post(
  `/`,
  file.array('file'),
  authenticateRequests,
  uploadController.uploadFile
)
router.delete(`/`, authenticateRequests, uploadController.deleteFile)

const uploadRoutes = router

export default uploadRoutes
