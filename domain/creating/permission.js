const baseHandler = require('./base')

module.exports = ({ httpTool, permissionService }) => {
  const { httpRouter, middleware } = httpTool
  const h = baseHandler({ service: permissionService })

  httpRouter.post(
    '/api/permissions',
    [middleware.JWTAuth],
    h.CreateAndInjectActor
  )
}
