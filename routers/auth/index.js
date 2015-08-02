import {Router} from 'express'
import bodyParser from 'body-parser'
import {loginService, pwdService} from '../../services/auth'
import checkAuth from '../../middlewares/checkAuth'

const router = Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.post('/', bodyParser.json(), (req, res, next) => {
  let {pwd} = req.body
  loginService.login(pwd)
    .then((token) => {
      // cookie 1 month expire
      res.cookie('token', token, {maxAge: 2592000000, httpOnly: true})
      res.json({status: 1})
    })
    .catch((e) => {console.log(e)
      res.status(200).json({status: 0})
    })
})

router.post('/reset', checkAuth, bodyParser.json(), (req, res, next) => {
  let {pwd} = req.body
  pwdService.setToken(pwd)
    .then(() => res.status(200).end())
    .catch(next)
})

router.get('/logout', (req, res, next) => {
  let token = req.get('Authorization')
  loginService.logout(token)
    .then(() => res.status(200).end())
    .catch(next)
})

export default router
