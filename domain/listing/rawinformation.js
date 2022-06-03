const baseHandler = require('./base')

module.exports = ({ httpTool, rawInformationService }) => {
  const { httpRouter, middleware } = httpTool
  const h = baseHandler({ service: rawInformationService })

  httpRouter.get('/api/raw-informations', [middleware.JWTAuth], h.GetAll)
  httpRouter.get(
    '/api/raw-informations/:rawInformationId',
    [middleware.JWTAuth],
    h.GetOne
  )
}
