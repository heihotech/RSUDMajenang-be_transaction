const { ResponseUtil } = require('../../internal/utils')
const baseHandler = require('./base')

module.exports = ({ httpTool, userService }) => {
  const { httpRouter, middleware } = httpTool
  const h = baseHandler({ service: userService })

  h.GetCurrentUser = async (req, res, next) => {
    try {
      return res.send(ResponseUtil.RespJSONOk(req.user))
    } catch (err) {
      next(err)
    }
  }

  h.CheckEmail = async (req, res, next) => {
    try {
      if (!req.body || !req.body.email) {
        throw new Error('need parameter')
      }

      return res.send(
        ResponseUtil.RespJSONOk({
          exists: await userService.CheckEmail(req.body.email),
        })
      )
    } catch (err) {
      next(err)
    }
  }

  httpRouter.get('/api/users', [middleware.JWTAuth], h.GetAll)
  httpRouter.get('/api/users/:userId', [middleware.JWTAuth], h.GetOne)
  httpRouter.get('/api/user/me', [middleware.JWTAuth], h.GetCurrentUser)
  httpRouter.post('/api/users/check/email', [middleware.JWTAuth], h.CheckEmail)
}
