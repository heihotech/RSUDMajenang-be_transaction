'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('profiles', {
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
      full_name: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      front_title: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      end_title: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      nik: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      nip: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      nip_type: {
        allowNull: true,
        type: Sequelize.ENUM('NIP', 'NIKY'),
        defaultValue: 'NIKY',
      },
      gender: {
        allowNull: true,
        type: Sequelize.ENUM('M', 'L'),
        defaultValue: 'L',
      },
      religion: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      birth_date: {
        allowNull: true,
        type: Sequelize.DATEONLY,
      },
      avatar_url: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      is_indonesian: {
        allowNull: true,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('profiles')
  },
}
