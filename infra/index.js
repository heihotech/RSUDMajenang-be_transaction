const postgre = require('./postgre')
const httpServer = require('./httpserver')

module.exports = {
  Init: async () => {
    const models = await postgre.Init()
    const httpRouter = httpServer.Init()

    return { models, httpRouter }
  },
}
