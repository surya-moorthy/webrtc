import { useEffect } from "react"


export default function Receiver() {
 
    useEffect(()=>{
        const socket = new WebSocket("ws://localhost:8080")
        socket.onopen = ()=>{
           socket.send(JSON.stringify({type  : "identify-as-receiver"}))
        }

        socket.onmessage = async (event) =>{
            const message = JSON.parse(event.data);
            if(message.type === "create-offer"){
                  const pc = new RTCPeerConnection();
                  pc.setRemoteDescription(message.sdp);
                  pc.onicecandidate = (event) =>{
                    if(event.candidate){
                       socket.send(JSON.stringify({type : "iceCandidate", candidate : event.candidate}))
                    }
                 }
                  const answer =await pc.createAnswer();
                  await pc.setLocalDescription(answer);
                  socket.send(JSON.stringify({type : "create-answer",sdp : answer}))
            }
        }
      },[])


  return (
    <div>
        HI there
    </div>
  )
}
