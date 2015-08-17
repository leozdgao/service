import { loginService } from '../services/auth'

export default (req, res, next) => {
  const token = req.signedCookies._t

  loginService.checkAuth(token)
    .then(next)
    .catch((e) => {
      e.status = 401
      next(e)
    })
}
