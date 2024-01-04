const socket = io();

const form = document.getElementById('form');
const input = document.getElementById('input');
const allMessages = document.getElementById('messages')

//get the event of the chat to the server
const userMessage= (e) => {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  }

form.addEventListener('submit', userMessage);


socket.on('chat message', (message) => {
    const item = document.createElement('li');
    item.textContent = message;
    allMessages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight)
})