const express = require('express');
const { v4: uuidv4 } = require('uuid');
const cors = require("cors");
const path = require('path');
const socket = require('socket.io');
const mongoose = require('mongoose');

const app = express();

const server = app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on port: 8000");
});

const io = socket(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  console.log("New Socket!");
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const testimonialRoutes = require('./routes/testimonials.routes');
const seatsRoutes = require('./routes/seats.routes');
const concertsRoutes = require('./routes/concerts.routes');

app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);
app.use('/api', testimonialRoutes);

app.use(express.static(path.join(__dirname, '/client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/build/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ message: '404 Not found' });
});

mongoose.connect("mongodb+srv://mgozdawa:IWt4XP4V8tRSidIJ@cluster0.ao19p.mongodb.net/NewWave?retryWrites=true&w=majority&appName=Cluster0", {});

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to database");
});
db.on("error", (err) => console.log("Error" + err));