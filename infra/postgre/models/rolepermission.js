'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RolePermission.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      guid: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      roleId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'roles',
          key: 'id',
        },
        field: 'role_id',
      },
      permissionId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'permissions',
          key: 'id',
        },
        field: 'permission_id',
      },
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'deleted_at',
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        field: 'updated_at',
      },
      deletedById: {
        allowNull: true,
        type: DataTypes.BIGINT,
        field: 'deleted_by_id',
      },
      createdById: {
        allowNull: true,
        type: DataTypes.BIGINT,
        field: 'created_by_id',
      },
      updatedById: {
        allowNull: true,
        type: DataTypes.BIGINT,
        field: 'updated_by_id',
      },
    },
    {
      sequelize,
      ...modelInit,
      modelName: 'RolePermission',
    }
  )
  return RolePermission
}
