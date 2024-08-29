const express = require('express');
const cors = require("cors");
const { v4: uuidv4 } = require('uuid'); 

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors()); 

const db = [
  { id: 1, author: 'John Doe', text: 'This company is worth every coin!' },
  { id: 2, author: 'Amanda Doe', text: 'They really know how to make you happy.' },
];

app.get('/testimonials', (req, res) => {
  res.json(db);
});

app.get('/testimonials/random', (req, res) => {
  if (db.length === 0) {
    return res.status(404).json({ message: 'No testimonials available' });
  }
  const randomIndex = Math.floor(Math.random() * db.length);
  const randomTestimonial = db[randomIndex];
  res.json(randomTestimonial);
});

app.get("/testimonials/:id", (req, res) => {
    const testimonialId = parseInt(req.params.id);
    const testimonial = db.find(
      (testimonial) => testimonial.id === testimonialId
    );
    if (testimonial) {
      res.json(testimonial);
    } else {
      res.status(404).json({ error: "Testimonial not found" });
    }
});

app.post('/testimonials', (req, res) => {
  const { author, text } = req.body;
  if (author && text) {
    const newId = db.length ? db[db.length - 1].id + 1 : 1; 
    const newTestimonial = { id: newId, author, text };
    db.push(newTestimonial);
    res.json({ message: 'OK' });
  } else {
    res.status(400).json({ message: 'Bad Request' });
  }
});

app.put('/testimonials/:id', (req, res) => {
  const { author, text } = req.body;
  const testimonialIndex = db.findIndex(t => t.id === parseInt(req.params.id));

  if (testimonialIndex !== -1) {
    if (author && text) {
      db[testimonialIndex] = { id: parseInt(req.params.id), author, text };
      res.json({ message: 'OK' });
    } else {
      res.status(400).json({ message: 'Bad Request' });
    }
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

app.delete('/testimonials/:id', (req, res) => {
  const testimonialIndex = db.findIndex(t => t.id === parseInt(req.params.id));

  if (testimonialIndex !== -1) {
    db.splice(testimonialIndex, 1);
    res.json({ message: 'OK' });
  } else {
    res.status(404).json({ message: 'Not found' });
  }
});

app.use((req, res) => {
  res.status(404).json({ message: '404 Not found XXX' });
})

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});
