const UserGame = require('./user_game')
const UserGameBiodata = require('./user_game_biodata')
const UserGameHistory = require('./user_game_history')

UserGame.hasOne(UserGameBiodata, {
    foreignKey: 'user_game_uuid',
    as: 'user_game_biodata'
})

UserGameBiodata.belongsTo(UserGame, {
    foreignKey: 'user_game_uuid',
    as: 'user_game'
})

UserGame.hasOne(UserGameHistory, {
    foreignKey: 'user_game_uuid',
    as: 'user_game_history'
})

UserGameHistory.belongsTo(UserGame, {
    foreignKey: 'user_game_uuid',
    as: 'user_game'
})


module.exports = {
    UserGame,
    UserGameBiodata,
    UserGameHistory
}
