const express =require('express')
const isLoggedIn = require('../middleware/authentication')
const router = express.Router()
const fs = require('fs')
const {uuid} = require('uuidv4')
const jwt = require('jsonwebtoken')
const bcrypt = require ('bcrypt')
const axios = require('axios')

//LANDING PAGE
router.get('/', (req, res, next) => {
    try {
        const token = req.cookies.jwt
    const status = req.query.status

    jwt.verify(token, 'secret', (err, decodedToken) => {
        res.locals.user = decodedToken
    })

    if(!status){  
        res.render('index',{
            pageTitle: "Main",
            token,
            status
        })
    }else if(status=="signupsuccsess"){
        res.render('index',{
            pageTitle: "Main",
            token,
            status,
            message: "Account Created Succsessfully, Please Login to Start The Game"
        })        
    } 
    } catch (error) {
        next(error)
    }
       
})


// ROUTING KE HALAMAN GAME 
router.get('/game', isLoggedIn, (req, res, next) => {
    try {
        res.render('game',{
            pageTitle: "Rock Paper Scissors"
        })
    } catch (error) {
        next(error)
    }
    
})

//ROUTING KE HALAMAN SIGNUP 
router.get('/signup', (req, res, next) => {
    try {
        const data = fs.readFileSync('./data/users.json', 'utf-8')
        const readData = JSON.parse(data)
        res.render('signup',{
        pageTitle: "SIGNUP",
    })
    } catch (error) {
        next(error)
    }
    
})


//METHOD POST UNTUK SIGNUP USER BARU
router.post('/signup', async (req, res, next) => {    
    try {
    const {nama , email, password} = req.body
    const hashedPassword = await bcrypt.hash(password,10)
    const data = fs.readFileSync('./data/users.json', 'utf-8')
    const readData = JSON.parse(data)
    const newUser = {
        id: uuid(),
        nama,
        email,
        password: hashedPassword
    }
    readData.push(newUser)
    fs.writeFileSync('./data/users.json', JSON.stringify(readData, null, 4))
    res.redirect('/?status=signupsuccsess')
    } catch (error) {
        next(error)
    }
    
})


//ROUTING KE HALAMAN LOGIN
router.get('/login', (req, res, next) => {
    try {
        const status = req.query.status
    if(!status){
    res.render('login',{
        pageTitle: "LOGIN",
        status
        })        
    }else if(status=="emailnotfound"){
            res.render('login',{
                pageTitle: "LOGIN",
                message : "Email Not Found",
                status
                })  
    }else if(status=="passwordnotmatch"){
            res.render('login',{
                pageTitle: "LOGIN",
                message : "Wrong Password",
                status
                })  
    }else if(status=="notlogin"){
            res.render('login',{
                pageTitle: "LOGIN",
                message : "Please Login First",
                status
                })  
    }else if(status=="tokenexpired"){
        res.render('login',{
            pageTitle: "LOGIN",
            message : "Your Session is Expired, Please Login Again",
            status
            })  
    }else if(status=="editsuccsess"){
        res.render('login',{
            pageTitle: "LOGIN",
            message : "Your Account Has Been Edited, Please Login Again",
            status
            })  
        }else{
            res.render('login',{
                pageTitle: "LOGIN",
                message : "You are not logged in, please login to Start The Game",
                })   
        }
    } catch (error) {
        next(error)
    }
    
    
})


//METHOD POST UNTUK LOGIN USER
router.post('/login', async (req, res, next) => {
    try {
    const {email, password} = req.body
    const data = JSON.parse(fs.readFileSync('./data/users.json', 'utf-8'))
    const findUser = await data.find((i) => i.email == email)      

    if(findUser){
        const validPassword = await bcrypt.compare(req.body.password, findUser.password)  
             
        if(validPassword){            
            const token = jwt.sign({
                username: findUser.nama,
                email : findUser.email,
                id: findUser.id
            }, 'secret', {
                expiresIn : 60*60*24
            })
            res.cookie('jwt', token, { maxAge:1000*60*60*24})
            res.redirect('/dashboard')
        }else{
            res.redirect('/login?status=passwordnotmatch')
        }
    }else{
        res.redirect('/login?status=emailnotfound')
    }
    } catch (error) {
        next(error)
    }
    
})

// ROUTING KE HALAMAN EDIT ACCOUNT
router.get('/edit', isLoggedIn, (req, res, next) => {
    try {
    const {id} = req.query
    const data = fs.readFileSync('./data/users.json', 'utf-8')
    const readData = JSON.parse(data)

    const dataFind = readData.find((i) => {
        return i.id == id
    })
    res.render('edit', {
        pageTitle: "Edit Account",
        dataFind
    })
    } catch (error) {
        next(error)
    }
    
})

// METHOD POST UNTUK EDIT DATA USER
router.post('/edit', async (req, res, next) => {
    try {
    const {id} = req.query
    const {nama , email, password} = req.body
    const hashedPassword = await bcrypt.hash(password,10)
    const data = fs.readFileSync('./data/users.json', 'utf-8')
    const readData = JSON.parse(data)

    const dataFind = readData.find((i) => {
        return i.id == id
    })
    const dataIndex = readData.findIndex((i) => {
        return i.id == id
    })

    const dataEdited = {
        id :id,
        nama: nama,
        email: email,
        password: (req.body.password == "") ? dataFind.password : hashedPassword
    }

    readData[dataIndex] = dataEdited
    fs.writeFileSync('./data/users.json', JSON.stringify(readData, null, 4))
    res.cookie('jwt', '', {maxAge:1})
    res.redirect('/login?status=editsuccsess')
    } catch (error) {
        next(error)
    }
    
})

router.post('/logout', (req, res, next) => {
    try {
        res.cookie('jwt', '', {maxAge:1})
        res.redirect('/')
    } catch (error) {
        next(error)
    }
    
})


// ---------------------------------------------------------------------------------- //

// DASHBOARD
router.get('/dashboard', isLoggedIn, async (req, res, next) => {
    try {
    const token = req.cookies.jwt
    const response = await axios.get('http://localhost:3000/api/usergame')

    jwt.verify(token, 'secret', (err, decodedToken) => {
        res.locals.user = decodedToken
    })
    res.render('dashboard',{
        pageTitle: "Game Dashboard",
        token,
        data: response.data.data
    })
    } catch (error) {
        next(error)
    }
    
})

router.get('/dashboard/biodata', isLoggedIn, async (req, res, next) => {
    try {
    const token = req.cookies.jwt
    const response = await axios.get('http://localhost:3000/api/usergamebiodata')  

    jwt.verify(token, 'secret', (err, decodedToken) => {
        res.locals.user = decodedToken
    })
    res.render('dashboard-biodata',{
        pageTitle: "Game Dashboard",
        token,
        data: response.data.data
    })
    } catch (error) {
        next(error)
    }
    
})

router.get('/dashboard/history', isLoggedIn, async (req, res, next) => {
    try {
        const token = req.cookies.jwt
    const response = await axios.get('http://localhost:3000/api/usergamehistory')

    jwt.verify(token, 'secret', (err, decodedToken) => {
        res.locals.user = decodedToken
    })
    res.render('dashboard-history',{
        pageTitle: "Game Dashboard",
        token,
        data: response.data.data
    })
    } catch (error) {
        next(error)
    }
    
})

//CRUD
router.get('/dashboard/new', isLoggedIn, async (req, res, next) => {
    try {
        res.render('dashboard-add',{
            pageTitle: "Create New User"
        })
    } catch (error) {
        next(error)
    }
    
})

router.get('/dashboard/edit', isLoggedIn, async (req, res, next) => {
    try {
    const { id } = req.query
    const response = await axios.get(`http://localhost:3000/api/usergame/${id}`)

    console.log(response.data.data);

    if (response.data.message === "SUCCESS") {
        res.render('dashboard-edit',{
            pageTitle: "Edit User Data",
            data: response.data.data
        })
      }
    } catch (error) {
        next(error)
    }
    
    
})

router.post('/dashboard/edit',isLoggedIn, async (req,res, next) => {
    try {
    const {id} = req.query
    const {username, email, name, hobby, address, city, date_of_birth, win, lose} = req.body

    const dataToEdit = {
        username,
        email,
        name,
        hobby,
        address,
        city,
        date_of_birth,
        win,
        lose
    }

    try {
        const response = await axios.put(`http://localhost:3000/api/usergame/${id}`, dataToEdit)
        res.redirect('/dashboard')
      } catch (error) {
        res.redirect(`/dashboard/edit?id=${id}`)
      }
    } catch (error) {
        next(error)
    }
    
})

router.post('/dashboard/new', isLoggedIn, async (req, res, next) => {
    try {
    const {username, email, name, hobby, address, city, date_of_birth} = req.body
    const newUserGame = {
        username,
        email,
        name,
        hobby,
        address,
        city,
        date_of_birth
    }

    const response = await axios.post('http://localhost:3000/api/usergame', newUserGame)
    if (response.status === 201) {
        res.redirect('/dashboard')
      } else {
        res.redirect("/add")
      }  
    } catch (error) {
        next(error)
    }
      
})

router.post('/dashboard/delete', async (req, res, next) => {
    try {
    const {id} = req.query
    const response = await axios.delete(`http://localhost:3000/api/usergame?id=${id}`)
    res.redirect('/dashboard')
    } catch (error) {
        next(error)
    }    
})

module.exports = router