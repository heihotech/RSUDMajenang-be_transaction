const { ResponseUtil } = require('../../internal/utils')

const handler = ({ service }) => {
  return {
    GetAll: async (req, res, next) => {
      try {
        const query = await service.ValidateQueries(req.query)
        const { data, meta } = await service.GetAll({ ...query })

        return res.send(ResponseUtil.RespJSONOk(data, meta))
      } catch (err) {
        next(err)
      }
    },
    GetOne: async (req, res, next) => {
      try {
        const params = await service.ValidateId({
          ...req.params,
        })
        const query = await service.ValidateQueries(req.query)
        const data = await service.GetOne({ ...params }, { ...query })

        return res.send(ResponseUtil.RespJSONOk(data))
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = handler
