const permissions = require('./sources/permissions')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('permissions', permissions)
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('permissions', null, {})
  },
}
