'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.belongsToMany(models.User, {
        through: models.UserRole,
        as: 'users',
      })
      Role.belongsToMany(models.Permission, {
        through: models.RolePermission,
        as: 'permissions',
      })
      Role.belongsTo(models.User, {
        foreignKey: 'createdById',
        as: 'createdBy',
      })
      Role.belongsTo(models.User, {
        foreignKey: 'deletedById',
        as: 'deletedBy',
      })
      Role.belongsTo(models.User, {
        foreignKey: 'updatedById',
        as: 'updatedBy',
      })
    }
  }
  Role.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
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
      deletedAt: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'deleted_at',
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
      modelName: 'Role',
    }
  )
  return Role
}
