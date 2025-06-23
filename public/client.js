document.addEventListener("DOMContentLoaded", () => {
    const socket = io('http://localhost:8000');

    const form = document.getElementById('send-container');
    const messageInput = document.getElementById('messageInp');
    const messageContainer = document.querySelector(".container");
    var audio = new Audio('sound/ting.mp3');

  const append = (message, position) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const messageElement = document.createElement('div');
    messageElement.innerText = `[${time}] ${message}`;
    messageElement.classList.add('message', position);
    messageContainer.append(messageElement);

    if (position === 'left') {
        audio.play();
    }
    messageContainer.scrollTop = messageContainer.scrollHeight;
};


    form.addEventListener('submit', (e) => {
        e.preventDefault();  
        const rawMessage = messageInput.value;
        const message = rawMessage.trim();
        if (message === '') return;
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    });

    const name = prompt("Enter your name to join");
    socket.emit('new-user-joined', name);

    socket.on('user-joined', name => {
        append(`${name} joined the chat`, 'right');
    });
    

    socket.on("receive", data => {
        if (data.name !== name)
            append(`${data.name}: ${data.message}`, "left");
    });

    socket.on("left", name => {
        append(`${name} left the chat`, "left");
    });
});
