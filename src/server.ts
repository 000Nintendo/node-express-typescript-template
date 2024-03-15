import mongoose from 'mongoose'
import app from './app'
import dotenv from 'dotenv'
import socketIo from 'socket.io'
import { AppGlobals } from './utils/enums'
import { CronJobs } from './jobs/cron.jobs'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

let databaseConnectionString = process.env.DATABASE_URL as string

mongoose.set('strictQuery', false)

if (process.env.STAGING_ENV == 'true') {
  databaseConnectionString = process.env.STAGING_DATABASE_URL as string
}

console.log('databaseConnectionString >>>', databaseConnectionString)

mongoose.connect(databaseConnectionString, { authSource: 'admin' })

const conn = mongoose.connection

conn.on('connected', function () {
  console.log('Database is connected successfully')
  app.locals.mongoose = conn
})

conn.on('disconnected', function () {
  console.log('Database is disconnected successfully')
})

conn.on('error', (err) => {
  console.log('error >>>', err)

  console.error.bind(console, 'connection error:')
})

/**
 * Start email jobs to send emails
 */
// CronJobs.StartEmailJobs()

let PORT = process.env.PORT || 5000

// Start the server on 6000 porn if server is not running on staging environment
if (process.env.STAGING_ENV == 'true') {
  PORT = 6000
}

console.log('PORT >>>', PORT)

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`)
})

// export const socket_io = new socketIo.Server(server)

// const io: AppSocketServer = new socketIo.Server(server);
// app.locals.io = io;
// app.set(AppGlobals.socketio, socket_io)

// registerSockets(socket_io)
