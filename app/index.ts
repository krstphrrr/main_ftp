require('dotenv').config();
import { connect } from './db/database'
import express from 'express'

import path from 'path'
import testRoute from './routes/testRoute'
import cors from 'cors'
// import { authCheck } from "./middleware/auth"
// const { auth } = require('express-oauth2-jwt-bearer');

const PORT = 5100;
const app = express()

app.use(cors({
  "origin": "*",
  "methods": "GET,PUT,OPTIONS",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}))

app.use(express.static('public'))
app.use(express.json({
  limit: '10mb'
}))
app.set('views', path.join(__dirname,'/views'))
app.set('view engine', 'ejs')

connect()
app.use('/api', testRoute)
app.get('/', (req,res)=>{
  console.log("working")
  res.send(__dirname)
})


app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})