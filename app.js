import express from 'express'
import dotenv from 'dotenv'
import db from './src/database/poll.database.js'
import routes from './src/routes/poll.routes.js'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const ConnectionString = process.env.ConnectionString || ""
try
{
    await db.Connect(ConnectionString)
    app.use(express.json())
    app.use("/", routes)
    app.use((req, res) => {
        res.status(404).json({message: "Không tìm thấy route hợp lệ"})
    })
    //////
    app.use((err, req, res, next) => {
        console.error(err.stack)
        res.status(500).json({
            error: err.message,
            message: "Đây là middleware error cuối cùng"
        })
    })
    app.listen(PORT, () => {
        console.log(`Server của mày đang chạy trên http://localhost:${PORT}`)
    })
}
catch(error)
{
    console.log("Lỗi khi bật server: ", error)
}