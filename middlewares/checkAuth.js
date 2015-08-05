import {loginService} from '../services/auth'

export default (req, res, next) => {
  let token = req.cookies.token

  loginService.checkAuth(token)
    .then(next)
    .catch((e) => {
      e.status = 401
      next(e)
    })
}
