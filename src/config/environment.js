import 'dotenv/config'

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  MONGODB_USERNAME: process.env.MONGODB_USERNAME,
  MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
  LOCAL_DEV_APP_PORT: process.env.LOCAL_DEV_APP_PORT || 8017,
  LOCAL_DEV_APP_HOST: process.env.LOCAL_DEV_APP_HOST || 'localhost',
  BUILD_MODE: process.env.BUILD_MODE || 'dev' // dev | production
}
