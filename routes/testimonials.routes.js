const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require("uuid");

router.route("/testimonials").get((req, res) => {
    res.json(db.testimonials);
});

router.route('/testimonials/random').get((req, res) => {
    if (db.testimonials.length === 0) {
        return res.status(404).json({ message: 'No testimonials available' });
    }
    const randomIndex = Math.floor(Math.random() * db.testimonials.length);
    const randomTestimonial = db.testimonials[randomIndex];
    res.json(randomTestimonial);
});

router.route("/testimonials/:id").get((req, res) => {
    const testimonialId = parseInt(req.params.id);
    const testimonial = db.testimonials.find(
        (testimonial) => testimonial.id === testimonialId
    );
    if (testimonial) {
        res.json(testimonial);
    } else {
        res.status(404).json({ error: "Testimonial not found" });
    }
});

router.route('/testimonials').post((req, res) => {
    const { author, text } = req.body;
    if (author && text) {
        const newId = db.testimonials.length ? db.testimonials[db.testimonials.length - 1].id + 1 : 1;
        const newTestimonial = { id: newId, author, text };
        db.testimonials.push(newTestimonial);
        res.json({ message: 'OK' });
    } else {
        res.status(400).json({ message: 'Bad Request' });
    }
});

router.route('/testimonials/:id').put((req, res) => {
    const { author, text } = req.body;
    const testimonialIndex = db.testimonials.findIndex(t => t.id === parseInt(req.params.id));

    if (testimonialIndex !== -1) {
        if (author && text) {
            db.testimonials[testimonialIndex] = { id: parseInt(req.params.id), author, text };
            res.json({ message: 'OK' });
        } else {
            res.status(400).json({ message: 'Bad Request' });
        }
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});

router.route('/testimonials/:id').delete((req, res) => {
    const testimonialIndex = db.testimonials.findIndex(t => t.id === parseInt(req.params.id));

    if (testimonialIndex !== -1) {
        db.testimonials.splice(testimonialIndex, 1);
        res.json({ message: 'OK' });
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});

module.exports = router;
