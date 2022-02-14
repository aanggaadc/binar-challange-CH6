const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DB, process.env.DBUSERNAME, process.env.DBPASSWORD, {
    host: process.env.DBHOST,
    dialect: process.env.DBDIALECT,
    port:process.env.DBPORT
  })


//   const connect = async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Connection has been established successfully.');
//       } catch (error) {
//         console.error('Unable to connect to the database:', error);
//       }
//   }

  module.exports = sequelize