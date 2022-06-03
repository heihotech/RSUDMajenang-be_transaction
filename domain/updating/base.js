const { ResponseUtil } = require('../../internal/utils')

const handler = ({ service }) => {
  return {
    Update: async (req, res, next) => {
      try {
        const params = await service.ValidateId({
          ...req.params,
        })
        const payload = await service.ValidateEditPayload({ ...req.body })
        const data = await service.Update({ ...params }, { ...payload })

        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
    UpdateAndInjectActor: async (req, res, next) => {
      try {
        const params = await service.ValidateId({
          ...req.params,
        })
        const payload = await service.ValidateEditPayload({ ...req.body })

        const validatedPayload = await service.InjectActor(
          payload,
          req.user,
          'update'
        )

        const data = await service.Update(
          { ...params },
          { ...validatedPayload }
        )

        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = handler
