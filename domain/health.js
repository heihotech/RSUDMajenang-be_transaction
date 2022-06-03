const si = require('systeminformation')

const handler = () => {
  return {
    HealthCheck: async (req, res, next) => {
      try {
        const cpu = await si.cpu()
        const mem = await si.mem()

        const { cores } = cpu
        const { total } = mem

        const divider = 1024 * 1024 * 1024
        const totalmem = total / divider

        res.status(200).send({
          message: 'ok',
          info: {
            cpu: `${cores}`,
            memory: `${totalmem.toFixed(2)}`,
          },
        })
      } catch (err) {
        next(err)
      }
    },
  }
}

module.exports = ({ httpTool }) => {
  const { httpRouter } = httpTool
  const h = handler()

  httpRouter.get('/health', [], h.HealthCheck)
}
