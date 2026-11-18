import { Router } from 'express'
import * as c from '../controllers/taskController.js'
import { validateId, validateTask, validateStatus } from '../middleware/validate.js'

const router = Router()

router.route('/').get(c.getTasks).post(validateTask, c.createTask)
router.route('/:id').get(validateId, c.getTask).put(validateId, validateTask, c.updateTask).delete(validateId, c.deleteTask)
router.patch('/:id/status', validateId, validateStatus, c.updateStatus)

export default router
