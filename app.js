import express from 'express'
import dotenv from 'dotenv'
import router from './src/routes/index.js'
import mongoInstance from './src/configs/mongoose.config.js'

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path'
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express()
dotenv.config()
//view engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src', 'views'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'views', 'index.html'));
});

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