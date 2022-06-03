const baseHandler = require('./base')

module.exports = ({ httpTool, permissionService }) => {
  const { httpRouter, middleware } = httpTool
  const h = baseHandler({ service: permissionService })

  httpRouter.get('/api/permissions', [middleware.JWTAuth], h.GetAll)
  httpRouter.get(
    '/api/permissions/:permissionId',
    [middleware.JWTAuth],
    h.GetOne
  )
}
