import {Router} from 'express'
import article from './article'
import auth from './auth'

const router = Router()

router.use('/article', article)
router.use('/auth', auth)

export default router
