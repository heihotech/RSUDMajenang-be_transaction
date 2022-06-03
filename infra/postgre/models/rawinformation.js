'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class RawInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RawInformation.belongsTo(models.Transaction, {
        foreignKey: 'transactionId',
        as: 'transaction',
      })
      RawInformation.belongsTo(models.User, {
        foreignKey: 'createdById',
        as: 'createdBy',
      })
      RawInformation.belongsTo(models.User, {
        foreignKey: 'deletedById',
        as: 'deletedBy',
      })
      RawInformation.belongsTo(models.User, {
        foreignKey: 'updatedById',
        as: 'updatedBy',
      })
    }
  }
  RawInformation.init(
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
      origin: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM(
          'SUCCESS',
          'PENDING',
          'FAIL',
          'CANCELED',
          'REVERSAL',
          'CREATED',
          'UPDATED'
        ),
      },
      transactionId: {
        allowNull: true,
        type: DataTypes.BIGINT,
        references: {
          model: 'transactions',
          key: 'id',
        },
        field: 'transaction_id',
      },
      referenceData: {
        allowNull: true,
        type: DataTypes.JSONB,
        field: 'reference_data',
      },
      externalExecutionTime: {
        allowNull: true,
        type: DataTypes.DATE,
        field: 'external_execution_time',
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
      modelName: 'RawInformation',
    }
  )
  return RawInformation
}
