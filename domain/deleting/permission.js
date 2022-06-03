const baseHandler = require('./base')

module.exports = ({ httpTool, permissionService }) => {
  const { httpRouter, middleware } = httpTool
  const h = baseHandler({ service: permissionService })

  httpRouter.delete(
    '/api/permissions/:permissionId',
    [middleware.JWTAuth],
    h.Delete
  )
  httpRouter.delete(
    '/api/permissions/:permissionId/force',
    [middleware.JWTAuth],
    h.DeleteForce
  )
  httpRouter.delete(
    '/api/permissions/:permissionId/restore',
    [middleware.JWTAuth],
    h.Restore
  )
}
