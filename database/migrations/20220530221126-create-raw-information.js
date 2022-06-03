'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('raw_informations', {
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
      origin: {
        allowNull: false,
        type: Sequelize.STRING,
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
      transaction_id: {
        allowNull: true,
        type: Sequelize.BIGINT,
        references: {
          model: 'transactions',
          key: 'id',
        },
      },
      reference_data: {
        allowNull: true,
        type: Sequelize.JSONB,
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
    await queryInterface.dropTable('raw_informations')
  },
}
