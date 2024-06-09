import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: 'mysql',
    host: process.env.DB_HOST,
    define: {
      timestamps: false
    }
  }
)
