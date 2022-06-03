'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Permission.belongsToMany(models.User, {
        through: models.UserPermission,
        as: 'users',
      })
      Permission.belongsToMany(models.Role, {
        through: models.RolePermission,
        as: 'roles',
      })
      Permission.belongsTo(models.User, {
        foreignKey: 'createdById',
        as: 'createdBy',
      })
      Permission.belongsTo(models.User, {
        foreignKey: 'deletedById',
        as: 'deletedBy',
      })
      Permission.belongsTo(models.User, {
        foreignKey: 'updatedById',
        as: 'updatedBy',
      })
    }
  }
  Permission.init(
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
      name: {
        unique: true,
        type: DataTypes.STRING,
      },
      path: {
        type: DataTypes.STRING,
      },
      method: {
        type: DataTypes.ENUM('post', 'put', 'get', 'patch', 'delete', 'del'),
        defaultValue: 'get',
      },
      description: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      isPublic: {
        defaultValue: false,
        type: DataTypes.BOOLEAN,
        field: 'is_public',
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
      modelName: 'Permission',
    }
  )
  return Permission
}
