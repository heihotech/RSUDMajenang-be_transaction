const { Sequelize } = require('sequelize')
const models = require('./models')
const { DBUser, DBPass, DBName, DBHost, DBPort, DBLog } =
  require('../../internal/config').Var

module.exports = {
  Init: async (config) => {
    const dbPort = DBPort !== '' ? Number(DBPort) : 5432
    const postgreCon = `postgres://${DBUser}:${DBPass}@${DBHost}:${dbPort}/${DBName}`
    const connection = new Sequelize(postgreCon, {
      pool: {
        min: 0,
        max: 50,
        idle: 10000,
      },
      logging: DBLog === 'true' ? console.log : false,
    })

    try {
      await connection.authenticate()
      console.log('Connection has been established successfully.')
    } catch (error) {
      console.error('Unable to connect to the database:', error)
    }

    module.exports.sequelize = connection

    return models.Init(connection)
  },
  Trx: {},
  sequelize: {},
}
