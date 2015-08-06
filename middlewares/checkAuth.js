import {loginService} from '../services/auth'

export default (req, res, next) => {
  let token = req.signedCookies._t

  loginService.checkAuth(token)
    .then(next)
    .catch((e) => {
      e.status = 401
      next(e)
    })
}
