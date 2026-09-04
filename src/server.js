/* eslint-disable no-console */
import { env } from '~/config/environment'
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'

const START_SERVER = () => {
  const app = express()

  const hostname = env.APP_HOST
  const port = env.APP_PORT

  app.get('/', async (req, res) => {
    console.log(await GET_DB().listCollections().toArray())

    res.end('<h1>Hello World!</h1><hr>')
  })

  app.listen(port, hostname, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello Trung Quan Dev, I am running at http://${ hostname }:${ port }/`)
  })
  exitHook(() => {
    CLOSE_DB()
  })
}

//Chỉ khi kết nối thành công với MongoDB mới khởi động server
(async () => {
  try {
    console.log('MongoDB connecting...')
    await CONNECT_DB()
    console.log('MongoDB connected successfully!')
    START_SERVER()
  } catch (error) {
    console.error('Error connecting to MongoDB:', error)
    process.exit(0) // Exit the process with an error code
  }
})()

// //Chỉ khi kết nối thành công với MongoDB mới khởi động server
// CONNECT_DB()
//   .then(() => {
//     console.log('MongoDB connected successfully!')
//   })
//   .then(() => {
//     START_SERVER()
//   })
//   .catch(error => {
//     console.error('Error connecting to MongoDB:', error)
//     process.exit(0) // Exit the process with an error code
//   })