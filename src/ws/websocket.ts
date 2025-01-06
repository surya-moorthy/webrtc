import { server } from "..";
import { WebSocketServer } from "ws"
const wss = new WebSocketServer({  server });

wss.on("connection", (ws)=>{
   ws.on("message",(data)=>{
    console.log(`client sent us a message ${data}`)
    ws.send(`server is replying to ${data}`)
   })    
})