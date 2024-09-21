const express = require('express')
const app = express()
const dotenv = require('dotenv')
dotenv.config()
app.use(express.json());

const db = require('./dbConnection')
const userRouter = require('./routes/userRouter')
const blogRouter = require('./routes/blogRouter')
const commentRouter = require('./routes/commentRouter')

const PORT = process.env.PORT
db.connect()
app.use('/users',userRouter)
app.use('/posts',blogRouter)
app.use('/comments',commentRouter)

app.use("/", (_, res) =>
    res.status(404).json({ code: 404, message: "page not found" })
);
app.listen(PORT ,() => console.log("Server running on PORT",PORT));
