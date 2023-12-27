const express = require('express')
const mongoose = require('mongoose')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 8000

const articleRouter = require('./routes/article')
const userRouter = require('./routes/user')

app.use(express.json())

app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Content-Length, Accept, Access-Control-Allow-Request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE, PATCH')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
    next();
})

mongoose.connect(process.env.MONGODB_URL)

app.use('/api', articleRouter, userRouter) // userRouter

app.get('*', (_req, res) => {
    res.status(404).send('Esta pagina no existe')
})

app.listen(port, () => {
    console.log(`https://localhost:8000/api/`)
})