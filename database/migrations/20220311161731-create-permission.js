'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      guid: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        unique: true,
        type: Sequelize.STRING,
      },
      path: {
        type: Sequelize.STRING,
      },
      method: {
        type: Sequelize.ENUM('post', 'put', 'get', 'patch', 'delete', 'del'),
        defaultValue: 'get',
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      is_public: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('permissions')
  },
}
