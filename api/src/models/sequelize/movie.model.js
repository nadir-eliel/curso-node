import { DataTypes } from 'sequelize'
import { sequelize } from '../../../sequelize.js'

export const Movie = sequelize.define('movies', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  director: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  poster: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  rate: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
})
