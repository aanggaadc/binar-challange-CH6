const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = require('../utils/databaseConnection')

class UserGame extends Model {}

UserGame.init({
  // Model attributes are defined here
  uuid:{
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
        msg: "Username Sudah Digunakan"
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
        msg: "Email Sudah Digunakan"
    }
  }
}, {
  sequelize,
  modelName: 'user_game',
  freezeTableName: true,
  createdAt: true,
  updatedAt: true
});

module.exports = UserGame