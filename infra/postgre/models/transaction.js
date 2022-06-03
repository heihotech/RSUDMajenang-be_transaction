'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.User, {
        foreignKey: 'createdById',
        as: 'createdBy',
      })
      Transaction.belongsTo(models.User, {
        foreignKey: 'deletedById',
        as: 'deletedBy',
      })
      Transaction.belongsTo(models.User, {
        foreignKey: 'updatedById',
        as: 'updatedBy',
      })
      Transaction.hasMany(models.RawInformation, {
        foreignKey: 'transactionId',
        as: 'histories',
      })
    }
  }
  Transaction.init(
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
      amount: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      amountPaid: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        field: 'amount_paid',
      },
      vaNumber: {
        type: DataTypes.INTEGER,
        unique: true,
        field: 'va_number',
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
      modelName: 'Transaction',
    }
  )
  return Transaction
}
