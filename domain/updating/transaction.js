const baseHandler = require('./base')

module.exports = ({ httpTool, transactionService }) => {
  const { httpRouter, middleware } = httpTool
  const h = baseHandler({ service: transactionService })

  httpRouter.patch(
    '/api/transactions/:transactionId',
    [middleware.JWTAuth],
    h.UpdateAndInjectActor
  )
}
