const { ResponseUtil } = require('../../internal/utils')

module.exports = ({ httpTool, transactionService }) => {
  const { httpRouter, middleware } = httpTool

  const PayOneByVaNumber = async (req, res, next) => {
    try {
      const data = await transactionService.PayOneByVaNumber({ ...req.body })

      return res.send(ResponseUtil.RespJSONOk(data))
    } catch (err) {
      next(err)
    }
  }
  const CancelOneByVaNumber = async (req, res, next) => {
    try {
      const data = await transactionService.CancelOneByVaNumber({ ...req.body })

      return res.send(ResponseUtil.RespJSONOk(data))
    } catch (err) {
      next(err)
    }
  }
  const ReversalOneByVaNumber = async (req, res, next) => {
    try {
      const data = await transactionService.ReversalOneByVaNumber({
        ...req.body,
      })

      return res.send(ResponseUtil.RespJSONOk(data))
    } catch (err) {
      next(err)
    }
  }

  httpRouter.post(
    '/api/transactions/pay-by-va-number',
    [middleware.JWTAuth],
    PayOneByVaNumber
  )
  httpRouter.post(
    '/api/transactions/cancel-by-va-number',
    [middleware.JWTAuth],
    CancelOneByVaNumber
  )
  httpRouter.post(
    '/api/transactions/reversal-by-va-number',
    [middleware.JWTAuth],
    ReversalOneByVaNumber
  )
}
