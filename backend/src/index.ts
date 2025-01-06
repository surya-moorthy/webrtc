import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

let senderSocket : WebSocket | null = null;
let receiverSocket : WebSocket | null = null;

wss.on("connection",(ws)=>{
    ws.on('message',(data : any)=>{
      const message = JSON.parse(data);
     if(message.type === "identify-as-sender"){
        console.log("sender set")
        senderSocket = ws;
     } else if(message.type === "identify-as-receiver"){
        console.log("receiver set")
        receiverSocket = ws;
     } else if(message.type === "create-offer"){
        console.log("offer set")
        receiverSocket?.send(JSON.stringify({type : "offer",sdp : message.sdp}))
     } else if(message.type === "create-answer"){
        console.log("answer set")
        senderSocket?.send(JSON.stringify({type : "answer",sdp : message.sdp}))
     } else if(message.type === 'iceCandidate'){
        if(ws === senderSocket){
            receiverSocket?.send(JSON.stringify({type : "iceCandidate",candidate : message.candidate}))
        }
        if(ws === receiverSocket){
            senderSocket?.send(JSON.stringify({type : "iceCandidate",candidate : message.candidate}))
        }
     }
    })
})