import { env } from '~/config/environment'
const MONGODB_URI = env.MONGODB_URI
const DATABASE_NAME = env.DATABASE_NAME

import { MongoClient, ServerApiVersion } from 'mongodb'

//Khởi tạo một đối tượng trelloDatabaseIntance ban đầu là null (vì chưa connect)
let trelloDatabaseInstance = null

//Khởi tạo một đối tượng mongoClientInstance để kết nối với MongoDB
const mongoClientInstance = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  //Gọi kết nối tới mongoDB Atlas
  await mongoClientInstance.connect()

  //Kết nối thành công thì lấy ra DB theo tên và gán lại vào biến trelloDatabaseInstance
  trelloDatabaseInstance = mongoClientInstance.db(DATABASE_NAME)
}

export const GET_DB = () => {
  //Nếu chưa kết nối thì throw ra lỗi
  if (!trelloDatabaseInstance) {
    throw new Error('MongoDB is not connected yet!')
  }
  return trelloDatabaseInstance
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

