const express = require('express');
const app = express();
const http = require('http');
const port = 3000;
const path = require('path')

/* setup a http server for an express app
 and creates a new socket instance that listens
 on the server. Upgrades the http request
*/
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server)


//route
app.use(express.static('./public'));
app.get('/', (req, res) => {
    const file = path.join(__dirname, '..', 'public', 'index.html')
  res.sendFile(file);
});

//listens for client activity
io.on('connection', (socket) =>{
    console.log("A user has connected")
    socket.on("video", (message) => {
     io.emit('video', message)
    })
})
 
server.listen(port, () => {
    console.log(`Microservice listening on port ${port}`);
  });