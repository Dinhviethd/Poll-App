import express from 'express'
import dotenv from 'dotenv'
import router from './src/routes/index.js'
import mongoInstance from './src/configs/mongoose.config.js'
const app = express()
dotenv.config()

async function startServer() {
  const connectString = process.env.MONGODB_URI
  console.log('Connecting to MongoDB...')
  await mongoInstance.connect(connectString)
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use('/api', router)

  app.use((req, res) => {
    res.status(404).send('Not Found')
  })
  app.use((err, req, res) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server run at http://localhost:${PORT}`)
  })
}
try {
    await startServer()
} catch (error) {
    console.error('Error starting server:', error)
}