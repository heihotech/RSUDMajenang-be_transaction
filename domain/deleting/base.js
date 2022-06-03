const { ResponseUtil } = require('../../internal/utils')

const handler = ({ service }) => {
  return {
    Restore: async (req, res, next) => {
      try {
        const params = await service.ValidateId({
          ...req.params,
        })
        const data = await service.Restore({ ...params })

        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
    Delete: async (req, res, next) => {
      try {
        const params = await service.ValidateId({
          ...req.params,
        })

        const validatedPayload = await service.InjectActor(
          {},
          req.user,
          'delete'
        )

        await service.Update({ ...params }, { ...validatedPayload })

        const data = await service.Delete({ ...params }, false)

        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
    DeleteForce: async (req, res, next) => {
      try {
        const params = await service.ValidateId({
          ...req.params,
        })
        const data = await service.Delete({ ...params }, true)

        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = handler
