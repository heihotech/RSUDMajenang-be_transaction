'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.BIGINT,
        autoIncrement: true,
      },
      guid: {
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      amount: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      amount_paid: {
        type: Sequelize.BIGINT,
        defaultValue: 0,
      },
      va_number: {
        type: Sequelize.INTEGER,
        unique: true,
      },
      status: {
        type: Sequelize.ENUM(
          'SUCCESS',
          'PENDING',
          'FAIL',
          'CANCELED',
          'REVERSAL',
          'CREATED',
          'UPDATED'
        ),
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transactions')
  },
}
