const baseHandler = require('./base')

module.exports = ({ httpTool, transactionService }) => {
  const { httpRouter, middleware } = httpTool
  const h = baseHandler({ service: transactionService })

  httpRouter.post(
    '/api/transactions',
    [middleware.JWTAuth],
    h.CreateAndInjectActor
  )
}
