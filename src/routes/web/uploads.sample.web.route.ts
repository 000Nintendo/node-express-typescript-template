import { Router } from 'express'
import { authenticateRequests } from '../../middlewares/authenticateRequest.middleware'

const multer = require('multer')

const file = multer({
  dest: 'src/uploads/',
  limits: {
    fieldSize: 8 * 1024 * 1024,
  },
})

const router = Router()

// router.post(
//   `/`,
//   file.array("file"),
//   authenticateRequests,
//   uploadController.uploadFile
// );
// router.delete(`/`, authenticateRequests, uploadController.deleteFile);

const uploadRoutes = router

export default uploadRoutes
