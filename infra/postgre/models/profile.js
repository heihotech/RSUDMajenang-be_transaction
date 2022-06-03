'use strict'
const { Model } = require('sequelize')
const { modelInit } = require('../config')
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Profile.hasOne(models.User, { foreignKey: 'profileId', as: 'user' })
    }
  }
  Profile.init(
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
      fullName: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'full_name',
      },
      frontTitle: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'front_title',
      },
      endTitle: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'end_title',
      },
      nik: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      nip: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      nipType: {
        allowNull: true,
        type: DataTypes.ENUM('NIP', 'NIKY'),
        defaultValue: 'NIKY',
        field: 'nip_type',
      },
      gender: {
        allowNull: true,
        type: DataTypes.ENUM('M', 'L'),
        defaultValue: 'L',
      },
      religion: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      birthDate: {
        allowNull: true,
        type: DataTypes.DATEONLY,
        field: 'birth_date',
      },
      avatarUrl: {
        allowNull: true,
        type: DataTypes.STRING,
        field: 'avatar_url',
      },
      isIndonesian: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        field: 'is_indonesian',
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
    },
    {
      sequelize,
      ...modelInit,
      modelName: 'Profile',
    }
  )
  return Profile
}
