const baseHandler = require('./base')

module.exports = ({ httpTool, rawInformationService }) => {
  const { httpRouter, middleware } = httpTool
  const h = baseHandler({ service: rawInformationService })

  httpRouter.delete(
    '/api/raw-informations/:rawInformationId',
    [middleware.JWTAuth],
    h.Delete
  )
  httpRouter.delete(
    '/api/raw-informations/:rawInformationId/force',
    [middleware.JWTAuth],
    h.DeleteForce
  )
  httpRouter.delete(
    '/api/raw-informations/:rawInformationId/restore',
    [middleware.JWTAuth],
    h.Restore
  )
}
