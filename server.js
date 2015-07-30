import express from 'express'
import serviceRouter from './routers/router'

const app = express()

app.use('/', serviceRouter)

// handle error
app.use((err, req, res, next) => {
  let status = err.status || 500
  res.status(status).json({msg: err.message || 'Unknown Error.'})
})

export default app
