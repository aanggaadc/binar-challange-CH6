const express =require('express')
const router = express.Router()
const { UserGame, UserGameBiodata, UserGameHistory } = require('../models')

//API USER GAME
router.get('/api/usergame', async (req, res, next) => {
    try {
        const userGameList = await UserGame.findAll({
            include: ['user_game_biodata', 'user_game_history']
        })
        res.status(200).json({
            message: "SUCCESS",
            data: userGameList
        })
    } catch (error) {
        next(error)        
    } 
    
})

router.get('/api/usergame/:id', async (req, res, next) => {
    try {
        const userGame = await UserGame.findOne({
            where: { uuid: req.params.id},
            include: ['user_game_biodata', 'user_game_history']
        })
        res.status(200).json({
            message: "SUCCESS",
            data: userGame
        })
    } catch (error) {
        next(error)        
    } 
    
})

router.post('/api/usergame', async (req, res, next) => {
    const {username, email, name, hobby, address, city, date_of_birth, win, lose} = req.body
    try {
        const newUserGame = await UserGame.create({
            username: username,
            email: email
        })

        await UserGameBiodata.create({
            name,
            hobby,
            address,
            city,
            date_of_birth,
            user_game_uuid: newUserGame.uuid
        })

        await UserGameHistory.create({
            win,
            lose,
            user_game_uuid: newUserGame.uuid
        })
        
        if(newUserGame){
            res.status(201).json({
                message: "SUCCSES",
                data: newUserGame
            })
        }else{
            res.status(400).json({
                message: "FAILED TO CREATE USER"
            })
        }
    } catch (error) {
        next(error)
    }
})

router.put('/api/usergame/:id', async (req, res, next) => {
    const {username, email, name, hobby, address, city, date_of_birth, win, lose} = req.body
    try {      
      const findUserGame = await UserGame.findByPk(req.params.id)
      if (findUserGame) {      
          const findUserBiodata = await UserGameBiodata.findOne({
              where: {
                user_game_uuid: req.params.id
              }
          })

          const updateUserBiodata = await findUserBiodata.update({
              name,
              hobby,
              address,
              city,
              date_of_birth
          })

          const findUserHistory = await UserGameHistory.findOne({
              where: {
                  user_game_uuid: req.params.id
              }
          })

          const updateUserHistory = await findUserHistory.update({
              win,
              lose
          })

        const updateUser = await findUserGame.update({
          username,
          email
        })
        res.status(200).json({
          message: "SUCCESS",
          data: updateUser
        })
      } else {
        res.status(404).json({
          message: "user not found"
        })
      }
    } catch (error) {
      next(error)
    }  
  })

  router.delete('/api/usergame', async (req, res, next) => {
    try {  
      const findUserGame = await UserGame.findByPk(req.query.id)
      if (findUserGame) {
        await UserGameHistory.destroy({
            where: {
              user_game_uuid: req.query.id
            }
          })

        await UserGameBiodata.destroy({
            where: {
              user_game_uuid: req.query.id
            }
          })

        await UserGame.destroy({
          where: {
            uuid: req.query.id
          }
        })

        res.status(200).json({
          message: "SUCCESS",
        })
      } else {
        res.status(404).json({
          message: "user not found"
        })
      }
    } catch (error) {
      next(error)
    }  
  })


//API USER BIODATA
router.get('/api/usergamebiodata', async (req, res, next) => {
    try {
        const userGameBiodataList = await UserGameBiodata.findAll({
            include: ['user_game']
        })
        res.status(200).json({
            message: "SUCCESS",
            data: userGameBiodataList
        })
    } catch (error) {
        next(error)        
    } 
    
})

router.post('/api/usergamebiodata', async (req, res, next) => {
    const {name, address, city, hobby, date_of_birth, user_game_uuid} = req.body
    try {
        const newUserGameBiodata = await UserGameBiodata.create({
            name,
            address,
            city,
            hobby,
            date_of_birth,
            user_game_uuid
        })
        
        if(newUserGameBiodata){
            res.status(201).json({
                message: "SUCCSES",
                data: newUserGameBiodata
            })
        }else{
            res.status(400).json({
                message: "FAILED TO CREATE USER"
            })
        }
    } catch (error) {
        next(error)
    }
})


//API USER HISTORY
router.get('/api/usergamehistory', async (req, res, next) => {
    try {
        const userGameHistory = await UserGameHistory.findAll({
            include: ['user_game']
        })
        res.status(200).json({
            message: "SUCCESS",
            data: userGameHistory
        })
    } catch (error) {
        next(error)        
    } 
    
})

router.post('/api/usergamehistory', async (req, res, next) => {
    const {win, lose, user_game_uuid} = req.body
    try {
        const newUserGameHistory = await UserGameHistory.create({
            win,
            lose,
            user_game_uuid
        })
        
        if(newUserGameHistory){
            res.status(201).json({
                message: "SUCCSES",
                data: newUserGameHistory
            })
        }else{
            res.status(400).json({
                message: "FAILED TO CREATE USER"
            })
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router