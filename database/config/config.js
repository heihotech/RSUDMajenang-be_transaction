require('dotenv').config()

module.exports = {
  development: {
    username: process.env.DBUser,
    password: process.env.DBPass,
    database: process.env.DBName,
    host: process.env.DBHost,
    dialect: 'postgres',
  },
  test: {
    username: process.env.DBUser,
    password: process.env.DBPass,
    database: process.env.DBName,
    host: process.env.DBHost,
    dialect: 'postgres',
  },
  production: {
    username: process.env.DBUser,
    password: process.env.DBPass,
    database: process.env.DBName,
    host: process.env.DBHost,
    dialect: 'postgres',
  },
  modelInit: {
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
}
