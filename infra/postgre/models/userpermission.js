'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class UserPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserPermission.init(
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
      userId: {
        type: DataTypes.BIGINT,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'user_id',
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
      modelName: 'UserPermission',
    }
  )
  return UserPermission
}
