const socket = io();
let peerConn;
let localStream;
let remoteStream;

let stun = {
  iceServer: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

let initialize = async () => {
  //ask webcam to allow  video and audio to output to the DOM inside the videPlayer elem
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false,
  });
  document.getElementById("videoPlayer1").srcObject = localStream;

};

let createOffer = async () => {
//create a peer connection instance and access to stun servers for Ice canidates
  console.log("test")
  peerConnection = new RTCPeerConnection(stun);

  remotestream = new MediaStream();
  document.getElementById("videoPlayer2").srcObject = remoteStream;
  console.log(document.getElementById("videoPlayer2").srcObject)

  //respond when a new track (video) connects to the peerconn
  localStream.getTracks().forEach((track) => [
    peerConnection.addTrack(track, localStream)
  ])

  //add remote stream to the ontrack value in the peerconnection object 
  peerConnection.ontrack = async (event) => {
   event.streams[0].getTracks.forEach((track) => {
    remoteStream.addTrack(track)
    })
  }
console.log(peerConnection.ontrack)
  // add localstream data to stun servers for ice canidates 
  peerConnection.onicecanidate = async (event) => {
    if(event.canidate){
      document.getElementById('offer-sdp').value = JSON.stringify(peerConnection.localDescription)

    }
  }

  console.log(peerConnection)
  
  //setup an display the peer offer
  let offer = await peerConnection.createOffer()
 const t = await peerConnection.setLocalDescription(offer)
  document.getElementById('offer-sdp').value = JSON.stringify(offer)


};

let createAnswer = async () => {
  peerConnection = new RTCPeerConnection(stun);

  remotestream = new MediaStream();
  document.getElementById("videoPlayer2").srcObject = remoteStream;
  console.log(document.getElementById("videoPlayer2").srcObject)

  //respond when a new track (video) connects to the peerconn
  localStream.getTracks().forEach((track) => [
    peerConnection.addTrack(track)
  ])

  //add remote stream to the ontrack value in the peerconnection object 
  peerConnection.ontrack = async (event) => {
   event.streams[0].getTracks.forEach((track) => {
    remoteStream.addTrack(track)
    })
  }
console.log(peerConnection)
  // add localstream data to stun servers for ice canidates 
  peerConnection.onicecanidate = async (event) => {
    if(event.canidate){
      document.getElementById('answer-sdp').value = JSON.stringify(peerConnection.localDescription)

    }
  }

  let offer = document.getElementById("offer-sdp").value
  if(!offer) return alert("Ask to connect with ID first...")
  offer =JSON.parse(offer)
  await peerConnection.setRemoteDescription(offer)

let answer = await peerConnection.createAnswer()
await peerConnection.setLocalDescription(answer)
document.getElementById('answer-sdp').value = JSON.stringify(answer)

}
// //get the event of the chat to the server
// const userMessage= (e) => {
//     e.preventDefault();
//     if (input.value) {
//       socket.emit('chat message', input.value);
//       input.value = '';
//     }
//   }

// form.addEventListener('submit', userMessage);

// socket.on('chat message', (message) => {
//     const item = document.createElement('li');
//     item.textContent = message;
//     allMessages.appendChild(item);
//     window.scrollTo(0, document.body.scrollHeight)
// })

initialize();
document.getElementById('create-offer').addEventListener('click', (createOffer))
document.getElementById('create-answer').addEventListener('click', (createAnswer ))