'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn('roles', 'deleted_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
    await queryInterface.addColumn('roles', 'created_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
    await queryInterface.addColumn('roles', 'updated_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
    await queryInterface.addColumn('permissions', 'deleted_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
    await queryInterface.addColumn('permissions', 'created_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
    await queryInterface.addColumn('permissions', 'updated_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
    await queryInterface.addColumn('user_roles', 'deleted_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
    await queryInterface.addColumn('user_roles', 'created_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
    await queryInterface.addColumn('user_roles', 'updated_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
    await queryInterface.addColumn('user_permissions', 'deleted_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
    await queryInterface.addColumn('user_permissions', 'created_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
    await queryInterface.addColumn('user_permissions', 'updated_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
    await queryInterface.addColumn('role_permissions', 'deleted_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
    await queryInterface.addColumn('role_permissions', 'created_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
    await queryInterface.addColumn('role_permissions', 'updated_by_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    })
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
}
