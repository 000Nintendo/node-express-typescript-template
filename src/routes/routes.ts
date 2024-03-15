import { Router } from 'express'
import TestController from '../controllers/test-controller'

const multer = require('multer')

const router = Router()

const upload = multer({
  dest: 'src/uploads/',
  limits: {
    fieldSize: 8 * 1024 * 1024,
  },
})

/**
 * Combine all your routes here
 */

/**
 * Test Route
 * Can be used for testing the different controllers and services file
 *
 */

router.post(
  '/api/test-route',
  // authenticateRequests,
  TestController.testFunction
)

router.post(
  '/api/test-email-template',
  // authenticateRequests,
  upload.single('featured_image'),
  TestController.testEmailTemplate
)

/**
 * Questionnaire routes
 */

const apiRoutes = router

export default apiRoutes
