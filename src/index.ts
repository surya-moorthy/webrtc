import express from "express"
import "dotenv/config"

const app = express()

app.use(express.json())

export const server = app.listen(process.env.PORT,()=>{
    console.log(`app is running on port ${process.env.PORT}` )
})

