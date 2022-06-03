const { ResponseUtil } = require('../../internal/utils')

const handler = ({ userService }) => {
  return {
    Create: async (req, res) => {
      try {
        return res.send(
          ResponseUtil.RespJSONOk(await userService.Create(req.body), {})
        )
      } catch (err) {
        return res.status(400).send(ResponseUtil.RespJSONError(err))
      }
    },
  }
}

module.exports = ({ httpTool, userService }) => {
  const { httpRouter, middleware } = httpTool
  const h = handler({ userService })

  httpRouter.post('/api/users', [middleware.JWTAuth], h.Create)
}
