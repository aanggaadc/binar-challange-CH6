require('dotenv').config()
const express =require('express')
const app = express()
const sequelize = require('./utils/databaseConnection')
const routes = require('./routes/router')


app.use(express.json())
app.use(routes)

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: statusCode,
      message: error.message
    })
  })


sequelize.sync().then(() => {
    const PORT = process.env.PORT
    app.listen(PORT, () => {
        console.log(`Server is Running at Port ${PORT}`)
    })
}).catch((error) => {
    console.log(error)
})
