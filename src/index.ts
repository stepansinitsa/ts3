import express from 'express';
import logger from '../src/middleware/logger';
import router from '../src/routes/bookRoute';
import error from '../src/middleware/error-404';
import viewRoute from '../src/routes/viewRoute.js';
import indexRoute from '../src/routes/index';
import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/books', router);
app.use('/books', viewRoute);
app.use('/', indexRoute);
app.use(logger);
app.use(error);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

io.on('connection', (socket: any) => {
  const { id } = socket;
  console.log(`Socket connected: ${id}`);

  const { roomName } = socket.handshake.query;
  console.log(`Socket roomName: ${roomName}`);

  socket.join(roomName);

  socket.on('message-to-room', (msg: any) => {
    msg.type = `roomName: ${roomName}`;
    socket.to(roomName).emit('message-to-room', msg);
    socket.emit('message-to-room', msg);
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${id}`);
  });
});

async function start(PORT: any, UrlDB: any) {
  try {
    await mongoose.connect(UrlDB);
    app.listen(PORT);
    console.log(
      `Сервер запущен: порту 8081, подключен к БД через порт ${UrlDB}`
    );
  } catch (e) {
    console.log('Ошибка подключения БД ', e);
  }
}

const UrlDB = process.env.UrlDB || 'mongodb://root:example@mongo:27017/';
const PORT = process.env.PORT || 3000;
start(PORT, UrlDB);
