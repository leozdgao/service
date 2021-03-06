import { Router } from 'express'
import bodyParser from 'body-parser'
import { loginService, pwdService } from '../../services/auth'
import checkAuth from '../../middlewares/checkAuth'

const router = Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/', (req, res, next) => {
  const { pwd } = req.body
  loginService.login(pwd)
    .then((token) => {
      // cookie 1 month expire
      res.cookie('_t', token, { maxAge: 2592000000, signed: true, httpOnly: true })
      res.json({ status: 1 })
    })
    .catch((e) => {
      res.status(200).json({ status: 0 })
    })
})

router.post('/reset', checkAuth, (req, res, next) => {
  const { oldpwd, newpwd } = req.body
  pwdService.checkToken(oldpwd)
    .then((isSame) => {
      if (isSame) {
        pwdService.setToken(newpwd)
          .then(() => {
            res.clearCookie()
            res.status(200).json({ status: 1 })
          }, next)
      }
      else res.status(200).json({ status: 0 })
    })
    .catch(next)
})

router.get('/logout', (req, res, next) => {
  const token = req.signedCookies._t
  loginService.logout(token)
    .then(() => {
      res.clearCookie('token')
      res.status(200).end()
    })
    .catch(next)
})

// route for returning personal info
router.get('/me', checkAuth, (req, res, next) => {
  res.status(200).json({})
})

export default router
