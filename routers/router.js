import { Router } from 'express'
import article from './article'
import auth from './auth'

const router = Router()

router.use('/api/article', article)
router.use('/auth', auth)

export default router
