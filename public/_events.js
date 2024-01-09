const socket = io();
let peerConnection;
let localStream;
let remoteStream;

let stun = {
  iceServers: [
     { urls: 'stun:freeturn.net:5349' }, { urls: 'turns:freeturn.tel:5349', username: 'free', credential: 'free' } 
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

let createPeerConnection = async () => {

}

let createOffer = async () => {
  //create a peer connection instance and access to stun servers for Ice canidates
  console.log("test");
  peerConnection = new RTCPeerConnection(stun);

  document.getElementById("videoPlayer2").srcObject = remoteStream;

  //respond when a new track (video) connects to the peerconn
  localStream
    .getTracks()
    .forEach((track) => {
      peerConnection.addTrack(track, localStream) 
      console.log(track, localStream)});

  //add remote stream to the ontrack value in the peerconnection object
  peerConnection.ontrack = (event) => {
    console.log("ontrack event:", event);
    if (event.streams && event.streams.length > 0) {
      var stream = event.streams[0];
      console.log("Remote stream tracks:", stream.getTracks());
    }
    document.getElementById("videoPlayer2").srcObject = remoteStream;
  };
  // add localstream data to stun servers for ice canidates
  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      document.getElementById("offer-sdp").value = JSON.stringify(
        peerConnection.localDescription
      );
    }
  };

  console.log(peerConnection);

  //setup an display the peer offer
  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  document.getElementById("offer-sdp").value = JSON.stringify(offer);

  console.log("Offer SDP:", JSON.stringify(offer));

  peerConnection.oniceconnectionstatechange = () => {
    console.log("ICE connection state:", peerConnection.iceConnectionState);
  };

};

let createAnswer = async () => {
  peerConnection = new RTCPeerConnection(stun);

  remoteStream = new MediaStream();
  peerConnection.ontrack = (event) => {
    console.log(event)
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
    document.getElementById("videoPlayer2").srcObject = remoteStream;
    console.log(remoteStream)
  };


  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });



  peerConnection.onicecandidate = async (event) => {
    if (event.candidate) {
      document.getElementById("answer-sdp").value = JSON.stringify(
        peerConnection.localDescription
      );
    }
  };
  peerConnection.oniceconnectionstatechange = () => {
    console.log("ICE connection state:", peerConnection.iceConnectionState);
  };

  let offer = document.getElementById("offer-sdp").value;
  if (!offer) return alert("Ask to connect with ID first...");
  offer = JSON.parse(offer);
  await peerConnection.setRemoteDescription(offer);

  let answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  document.getElementById("answer-sdp").value = JSON.stringify(answer);
  console.log(answer)
  console.log("Answer SDP:", JSON.stringify(answer));


};

//response needed to local from remote to finalize video connection.
let addAnswer = async () => {
  let clientAnswer = document.getElementById("answer-sdp").value
  if(!clientAnswer) return alert("A client response is needed")
  clientAnswer = JSON.parse(clientAnswer)
console.log(clientAnswer)
if(!peerConnection.currentRemoteDescription){
peerConnection.setRemoteDescription(clientAnswer)
console.log(peerConnection)
}

console.log("Client Answer SDP:", (clientAnswer));
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
document.getElementById("create-offer").addEventListener("click", createOffer);
document
  .getElementById("create-answer")
  .addEventListener("click", createAnswer);
  document.getElementById("add-answer").addEventListener("click", addAnswer);

