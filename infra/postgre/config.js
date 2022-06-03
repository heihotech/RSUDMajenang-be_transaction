module.exports = {
  conf: {
    username: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_PROD,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  modelInit: {
    timestamps: true,
    paranoid: true,
    underscored: true,
    // createdAt: 'created_at',
    // updatedAt: 'updated_at',
    // deletedAt: 'deleted_at',
  },
}
