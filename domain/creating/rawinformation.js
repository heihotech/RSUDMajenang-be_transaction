const baseHandler = require('./base')

module.exports = ({ httpTool, rawInformationService }) => {
  const { httpRouter, middleware } = httpTool
  const h = baseHandler({ service: rawInformationService })

  httpRouter.post(
    '/api/raw-informations',
    [middleware.JWTAuth],
    h.CreateAndInjectActor
  )
}
