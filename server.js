const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('./db');
const cors = require("cors");
const path = require('path');
const socket = require('socket.io');

const app = express();

// Tworzenie serwera HTTP
const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on port: 8000");
});

// Tworzenie instancji Socket.IO
const io = socket(server);

// Middleware, który dodaje instancję io do obiektu żądania
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Obsługa połączenia Socket.IO
io.on("connection", (socket) => {
  console.log("New Socket!");
});

// Umożliwienie parsowania danych URL i JSON
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Konfiguracja tras
const testimonialRoutes = require('./routes/testimonials.routes');
const seatsRoutes = require('./routes/seats.routes');
const concertsRoutes = require('./routes/concerts.routes');

app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);
app.use('/api', testimonialRoutes);

// Umożliwienie serwowania plików statycznych z katalogu build
app.use(express.static(path.join(__dirname, '/client/build')));

// Obsługa wszystkich innych tras
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

// Obsługa błędów 404
app.use((req, res) => {
  res.status(404).json({ message: '404 Not found' });
});
