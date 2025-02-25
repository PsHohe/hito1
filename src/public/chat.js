let socket;
let currentRoom = '';

// Función para conectar al socket con JWT
async function connectSocket() {
    try {
        console.log('Intentando conectar al socket...');
        socket = io('/chat', {
            withCredentials: true, // Esto permite enviar cookies con la solicitud
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 10000
        });

        // Manejar eventos de conexión
        socket.on('connect', () => {
            console.log('Conectado al servidor de chat con ID:', socket.id);
            document.getElementById('loginContainer').style.display = 'none';
            document.getElementById('chatContainer').style.display = 'block';
        });

        socket.on('connect_error', (error) => {
            console.error('Error de conexión:', error);
            document.getElementById('loginContainer').style.display = 'block';
            document.getElementById('chatContainer').style.display = 'none';
            alert('Error de conexión: ' + error.message);
        });

        socket.on('disconnect', (reason) => {
            console.log('Desconectado del servidor:', reason);
            if (reason === 'io server disconnect') {
                // la desconexión fue iniciada por el servidor, reconecta manualmente
                socket.connect();
            }
            // Limpiar la sala actual cuando se desconecta
            currentRoom = '';
            document.getElementById('currentRoom').textContent = 'No conectado';
        });

        socket.on('error', (error) => {
            console.error('Error del socket:', error);
        });

        // Manejar mensajes entrantes
        socket.on('message', (message) => {
            console.log('Mensaje recibido:', message);
            if (message.room === currentRoom) {
                appendMessage(message);
            }
        });

        // Manejar actualizaciones de la lista de usuarios
        socket.on('users', (users) => {
            console.log('Actualización de usuarios recibida:', users);
            updateUsersList(users);
        });

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Tiempo de conexión agotado'));
            }, 10000);

            socket.on('connect', () => {
                clearTimeout(timeout);
                resolve(socket);
            });

            socket.on('connect_error', (error) => {
                clearTimeout(timeout);
                reject(error);
            });
        });
    } catch (error) {
        console.error('Error al conectar:', error);
        document.getElementById('loginContainer').style.display = 'block';
        document.getElementById('chatContainer').style.display = 'none';
        throw error;
    }
}

// Manejar envío del formulario de inicio de sesión
async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Error al iniciar sesión');
        }

        // Después de iniciar sesión, conectar al socket
        await connectSocket();
        console.log('Conexión de socket establecida después de iniciar sesión');
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        alert('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
    }
}

// Unirse a una sala
function joinRoom() {
    try {
        console.log('Intentando unirse a la sala...', socket?.connected);
        const roomSelect = document.getElementById('roomSelect');
        const newRoom = roomSelect.value;
        console.log('Sala seleccionada:', newRoom);

        if (!socket?.connected) {
            console.error('Socket no conectado, intentando reconectar...');
            connectSocket().then(() => {
                console.log('Reconectado, ahora uniéndose a la sala');
                joinRoomAfterConnection(newRoom);
            }).catch(error => {
                console.error('Error al reconectar:', error);
                alert('No se pudo conectar al servidor de chat. Por favor, inténtelo de nuevo.');
            });
            return;
        }

        joinRoomAfterConnection(newRoom);
    } catch (error) {
        console.error('Error al unirse a la sala:', error);
        alert('No se pudo unirse a la sala. Por favor, inténtelo de nuevo.');
    }
}

// Función auxiliar para unirse a la sala después de asegurar la conexión
function joinRoomAfterConnection(newRoom) {
    if (currentRoom) {
        console.log('Saliendo de la sala actual:', currentRoom);
        socket.emit('leaveRoom', currentRoom);
    }

    console.log('Uniendo a la nueva sala:', newRoom);
    socket.emit('joinRoom', newRoom);
    currentRoom = newRoom;
    document.getElementById('currentRoom').textContent = newRoom;
    document.getElementById('messages').innerHTML = '';
    console.log('Unido a la sala exitosamente');
}

// Enviar un mensaje
function sendMessage(event) {
    event.preventDefault();

    if (!currentRoom) {
        alert('Por favor, únase a una sala primero');
        return;
    }

    if (!socket?.connected) {
        alert('No conectado al servidor de chat. Por favor, inténtelo de nuevo.');
        return;
    }

    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message) {
        console.log('Enviando mensaje a la sala:', currentRoom);
        socket.emit('sendMessage', {
            room: currentRoom,
            message: message
        });
        messageInput.value = '';
    }
}

// Append mensaje a chat
function appendMessage(message) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    const isOwnMessage = message.userId === socket.id;

    messageElement.className = `message ${isOwnMessage ? 'sent' : 'received'} clearfix`;
    messageElement.innerHTML = `
        <div class="username">${message.username}</div>
        <div class="content">${message.content}</div>
        <div class="timestamp">${new Date(message.timestamp).toLocaleTimeString()}</div>
    `;

    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Actualizar lista de usuarios
function updateUsersList(users) {
    const usersDiv = document.getElementById('users');
    usersDiv.innerHTML = users.map(user => `
        <div>${user.username} (Se unió: ${new Date(user.joinedAt).toLocaleTimeString()})</div>
    `).join('');
} 