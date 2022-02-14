const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = require('../utils/databaseConnection')

class UserGameHistory extends Model { }

UserGameHistory.init({
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  win: {
    defaultValue: 0,
    type: DataTypes.INTEGER
  },
  lose: {
    defaultValue: 0,
    type: DataTypes.INTEGER
  },
  user_game_uuid: {
    type: DataTypes.UUID,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'user_game_history',
  freezeTableName: true, 
  createdAt: true,
  updatedAt: true,
});

module.exports = UserGameHistory