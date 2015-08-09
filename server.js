import express from 'express'
import cors from 'cors'
import url from 'url'
import cookieParser from 'cookie-parser'
import serviceRouter from './routers/router'

const app = express()
const corsOption = {
  origin (origin, cb) {
    let hostname = url.parse('' + origin).hostname
    cb(null, hostname == 'localhost') // enable localhost request
  },
  credentials: true
}

app.use(cors(corsOption))
app.use(cookieParser('leozdgao'))
app.use('/', serviceRouter)

// handle error
app.use((err, req, res, next) => {
  let status = err.status || 500
  res.status(status).json({msg: err.message || 'Unknown Error.'})
})

export default app
