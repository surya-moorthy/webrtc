import { useEffect, useState } from "react"


export default function Sender() {
  const [socket,setSocket] = useState<WebSocket|null>(null);

  useEffect(()=>{
    const socket = new WebSocket("ws://localhost:8080")
    setSocket(socket)
    socket.onopen = ()=>{
       socket.send(JSON.stringify({type  : "identify-as-sender"}))
    }
  },[])

  async function StartSendingVideo() {
    if(!socket) return
    
     const pc = new RTCPeerConnection();
     const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    pc.onicecandidate = (event) =>{
       if(event.candidate){
          socket.send(JSON.stringify({type : "iceCandidate", candidate : event.candidate}))
       }
    }
    socket?.send(JSON.stringify({type : "create-offer",sdp : pc.localDescription}))
    

    socket.onmessage = (event) =>{
       const message = JSON.parse(event.data);
       if(message.type === "create-answer"){
        pc.setRemoteDescription(message.sdp)
       }else if(event.type === "iceCandidate"){
               pc.addIceCandidate(message.candidate)
       }
    }


    const getVideoMedia = await navigator.mediaDevices.getUserMedia({video : true})
    const video = document.createElement('video')
    video.srcObject = getVideoMedia;
    video.play()
    document.body.appendChild(video);
    getVideoMedia.getTracks().forEach((track)=>{
      pc.addTrack(track)
    })


  }
  return (
    <div>
        <button onClick={StartSendingVideo}>
            Send video
        </button>
    </div>
  )
}

