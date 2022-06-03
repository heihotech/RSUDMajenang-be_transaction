const { ResponseUtil } = require('../../internal/utils')

const handler = ({ service }) => {
  return {
    CreateAndInjectActor: async (req, res, next) => {
      try {
        const payload = await service.ValidateCreatePayload({
          ...req.body,
        })

        const validatedPayload = await service.InjectActor(
          payload,
          req.user,
          'create'
        )

        const data = await service.Create({ ...validatedPayload })

        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
    Create: async (req, res, next) => {
      try {
        const payload = await service.ValidateCreatePayload({
          ...req.body,
        })

        const data = await service.Create({ ...payload })

        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = handler
