const baseHandler = require('./base')

module.exports = ({ httpTool, rawInformationService }) => {
  const { httpRouter, middleware } = httpTool
  const h = baseHandler({ service: rawInformationService })

  httpRouter.patch(
    '/api/raw-informations/:rawInformationId',
    [middleware.JWTAuth],
    h.UpdateAndInjectActor
  )
}
