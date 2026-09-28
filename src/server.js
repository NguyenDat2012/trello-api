/* eslint-disable no-console */
import { env } from '~/config/environment'
import express from 'express'
import cors from 'cors'
import { corsOptions } from '~/config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, GET_DB, CLOSE_DB } from '~/config/mongodb'
import { APIs_V1 } from '~/routes/v1'
import { errorHandlingMiddleware } from '~/middlewares/errorHandingMiddleware'

const START_SERVER = () => {
  const app = express()

  //Xử lý cors
  app.use(cors(corsOptions))

  //Enable req.body json data
  app.use(express.json())

  //Use APIs_V1
  app.use('/v1', APIs_V1)

  //Middleware xử lý lỗi tập trung
  app.use(errorHandlingMiddleware)

  app.get('/', async (req, res) => {
    //console.log(await GET_DB().listCollections().toArray())

    res.end('<h1>Hello World!</h1><hr>')
  })

  if (env.BUILD_MODE === 'production') {
    // Render cấp PORT qua biến môi trường, và cần bind vào 0.0.0.0
    app.listen(process.env.PORT, () => {
      console.log(`Production: Running on port ${process.env.PORT}`)
    })
  } else {
    app.listen(env.APP_PORT, env.APP_HOST, () => {
      console.log(`Local DEV: http://${env.LOCAL_DEV_APP_HOST}:${env.LOCAL_DEV_APP_PORT}/`)
    })
  }
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
    process.exit(1) // Exit the process with an error code
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