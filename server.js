const express = require('express');
const { v4: uuidv4 } = require('uuid'); 
const db = require('./db');

const app = express();
const testimonialRoutes = require('./routes/testimonials.routes');
const seatsRoutes = require('./routes/seats.routes');
const concertsRoutes = require('./routes/concerts.routes');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', concertsRoutes);
app.use('/api', seatsRoutes);
app.use('/api', testimonialRoutes)

app.use((req, res) => {
  res.status(404).json({ message: '404 Not found XXX' });
})

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
