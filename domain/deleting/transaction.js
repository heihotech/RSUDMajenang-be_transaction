const baseHandler = require('./base')

module.exports = ({ httpTool, transactionService }) => {
  const { httpRouter, middleware } = httpTool
  const h = baseHandler({ service: transactionService })

  httpRouter.delete(
    '/api/transactions/:transactionId',
    [middleware.JWTAuth],
    h.Delete
  )
  httpRouter.delete(
    '/api/transactions/:transactionId/force',
    [middleware.JWTAuth],
    h.DeleteForce
  )
  httpRouter.delete(
    '/api/transactions/:transactionId/restore',
    [middleware.JWTAuth],
    h.Restore
  )
}
