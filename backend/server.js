const express = require('express');
//setup server and handle http
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 3000;
const path = require('path')
const { Server } = require("socket.io");
const io = new Server(server)

app.use(express.static('./public'));
app.get('/', (req, res) => {
    const file = path.join(__dirname, '..', 'public', 'index.html')
  res.sendFile(file);
});

io.on('connection', (socket) =>{
    console.log("Connected")
})
 
server.listen(port, () => {
    console.log(`Microservice listening on port ${port}`);
  });