import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { environment } from './environment';
import userService from '../services/user.service';

interface Message {
  id: number;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  room: string;
}

interface User {
  id: string;
  username: string;
  joinedAt: Date;
}

// Almacenar usuarios conectados y mensajes en memoria
export const connectedUsers: { [key: string]: User } = {};
export const messages: Message[] = [];

export const initializeSocket = (httpServer: HttpServer): SocketServer => {
  const io = new SocketServer(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Crear espacio de nombres de chat
  const chat = io.of('/chat');

  // Función auxiliar para transmitir mensaje a una sala
  const broadcastToRoom = (room: string, messageData: Message) => {
    // Usando to() incluye todos los sockets en la sala, incluyendo el remitente
    chat.to(room).emit('message', messageData);
  };

  // Middleware de autenticación
  chat.use(async (socket, next) => {
    try {
      console.log('Intento de autenticación de socket');
      const cookies = socket.request.headers.cookie;

      const token = cookies?.split(';')
        .find(c => c.trim().startsWith('token='))
        ?.split('=')[1];

      console.log('Token extraído:', token ? 'presente' : 'ausente');

      if (!token) {
        console.log('Autenticación fallida: No se proporcionó un token');
        return next(new Error('Autenticación requerida'));
      }

      const decoded = jwt.verify(token, environment.jwtSecret) as JwtPayload;
      console.log('Token verificado, ID de usuario:', decoded.id);

      // Obtener usuario de la base de datos
      const user = await userService.getUserById(decoded.id);
      if (!user) {
        console.log('Usuario no encontrado en la base de datos');
        return next(new Error('Usuario no encontrado'));
      }

      // Almacenar datos del usuario en el socket
      socket.data.user = {
        id: user.id,
        username: user.email.split('@')[0], // Usar el nombre de usuario del correo electrónico como nombre de usuario
        email: user.email
      };

      console.log('Usuario autenticado:', socket.data.user.username);
      next();
    } catch (error) {
      console.error('Error de autenticación:', error);
      next(new Error('Token inválido'));
    }
  });

  // Handle chat connections
  chat.on('connection', (socket) => {
    console.log('Intento de conexión de nuevo socket');
    const username = socket.data.user?.username;
    
    if (!username) {
      console.log('Conexión rechazada: No se proporcionó un nombre de usuario');
      socket.disconnect();
      return;
    }

    console.log(`Usuario ${username} conectado con ID de socket: ${socket.id}`);

    // Agregar usuario a usuarios conectados
    connectedUsers[socket.id] = {
      id: socket.id,
      username,
      joinedAt: new Date()
    };

    // Transmitir lista de usuarios actualizada
    chat.emit('users', Object.values(connectedUsers));

    // Handle joining rooms
    socket.on('joinRoom', (room: string) => {
      console.log(`Usuario ${username} se une a la sala: ${room}`);
      socket.join(room);
      
      const messageData: Message = {
        id: Date.now(),
        userId: socket.id,
        username,
        content: `${username} joined the room`,
        timestamp: new Date(),
        room
      };

      broadcastToRoom(room, messageData);
    });

    // Handle messages
    socket.on('sendMessage', ({ room, message }: { room: string, message: string }) => {
      if (!room) {
        console.log('Mensaje rechazado: No se especificó una sala');
        return;
      }

      console.log(`Mensaje de ${username} en la sala ${room}: ${message}`);
      const messageData: Message = {
        id: Date.now(),
        userId: socket.id,
        username,
        content: message,
        timestamp: new Date(),
        room
      };

      messages.push(messageData);
      broadcastToRoom(room, messageData);
    });

    // Manejar la salida de las salas
    socket.on('leaveRoom', (room: string) => {
      console.log(`Usuario ${username} se va de la sala: ${room}`);
      socket.leave(room);
      const messageData: Message = {
        id: Date.now(),
        userId: socket.id,
        username,
        content: `${username} se ha ido de la sala`,
        timestamp: new Date(),
        room
      };
      broadcastToRoom(room, messageData);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Usuario ${username} desconectado`);
      delete connectedUsers[socket.id];
      chat.emit('users', Object.values(connectedUsers));
    });
  });

  return io;
}; 