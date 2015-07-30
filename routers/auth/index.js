import {Router} from 'express'
import bodyParser from 'body-parser'
import {loginService} from '../../services/auth'

const router = Router()

router.post('/', bodyParser.json(), (req, res, next) => {
  let {pwd} = req.body
  loginService.login(pwd)
    .then((token) => {
      res.status(200).json({token})
    })
    .catch(next)
})

export default router
