import mongoose from 'mongoose'
import config from './config.json'

// connect to db async
let connected = false
// set db connectiion config, timeout
const timeout = process.env.DBTIMEOUT || config.db.timeout
const dbConfig = {
  server: {
    socketOptions: { connectTimeoutMS: timeout }
  }
}
const dbConncetion = process.env.DBCONNECTION || config.db.connection

mongoose.connect(dbConncetion, dbConfig)
console.log('Try to connect to DB, timeout set to ' + timeout + 'ms')

mongoose.connection.on('connected', () => {
  console.log('Connected to DB...')
  connected = true
})

mongoose.connection.on('disconnected', () => {
  // after a successful connecting,
  // mongoose will reconnect automatically if connection disconnected.
  if (!connected) {
    console.error('DBConnection closed. Try to reconnect.')

    setTimeout(() => {
      mongoose.connection.open(config.db.connection, dbConfig)
    }, timeout)
  }
})

mongoose.connection.on('error', (err) => {
  console.error('Error occurred: ' + err.message)
})
