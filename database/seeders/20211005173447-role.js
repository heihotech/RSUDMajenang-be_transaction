const roles = require('./sources/roles')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert('roles', roles)
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('roles', null, {})
  },
}
