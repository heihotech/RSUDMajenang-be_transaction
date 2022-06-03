const { ResponseUtil } = require('../../internal/utils')
const baseHandler = require('./base')

module.exports = ({ httpTool, transactionService }) => {
  const { httpRouter, middleware } = httpTool
  const h = baseHandler({ service: transactionService })

  const GetOneByVaNumber = async (req, res, next) => {
    try {
      const data = await transactionService.GetOneByVaNumber({ ...req.body })

      return res.send(ResponseUtil.RespJSONOk(data))
    } catch (err) {
      next(err)
    }
  }

  httpRouter.get('/api/transactions', [middleware.JWTAuth], h.GetAll)
  httpRouter.get(
    '/api/transactions/find-by-va-number',
    [middleware.JWTAuth],
    GetOneByVaNumber
  )
  httpRouter.get(
    '/api/transactions/:transactionId',
    [middleware.JWTAuth],
    h.GetOne
  )
}
