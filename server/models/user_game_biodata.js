const { Sequelize, DataTypes, Model } = require('sequelize')
const sequelize = require('../utils/databaseConnection')

class UserGameBiodata extends Model { }

UserGameBiodata.init({
  uuid: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  address: DataTypes.STRING(255),
  city: DataTypes.STRING(255),
  hobby: DataTypes.STRING(255),
  date_of_birth: DataTypes.DATE,
  user_game_uuid: {
      type: DataTypes.UUID,
      allowNull: false
  }
},
  {  
  sequelize,
  modelName: 'user_game_biodata',
  freezeTableName: true,
  createdAt: true,
  updatedAt: true
})

module.exports = UserGameBiodata