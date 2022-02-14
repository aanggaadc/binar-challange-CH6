const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

const routes = require('./routes/router')
const PORT = 5000

app.set('view engine', 'ejs')
app.set('views', './public/views')

app.use(express.static(__dirname + '/public'))
app.use(express.urlencoded({extended : true}))
app.use(express.json())
app.use(cookieParser())
app.use(routes)

app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      error: statusCode,
      message: error.message
    })
  })

app.listen(PORT, () => {
    console.log(`Server Running at PORT ${PORT}`)
})