const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require("uuid");

router.route('/seats').get((req, res) => {
    res.json(db.seats);
});

router.route('/seats/:id').get((req, res) => {
    const seatId = parseInt(req.params.id);
    const seat = db.seats.find(s => s.id === seatId);
    if (seat) {
        res.json(seat);
    } else {
        res.status(404).json({ error: "Seat not found" });
    }
});

router.route('/seats').post((req, res) => {
    const { day, seat, client, email } = req.body;
    if (day && seat && client && email) {
        const newId = db.seats.length ? db.seats[db.seats.length - 1].id + 1 : 1;
        const newSeat = { id: newId, day, seat, client, email };
        db.seats.push(newSeat);
        res.json({ message: 'OK', seat: newSeat });
    } else {
        res.status(400).json({ message: 'Bad Request' });
    }
});

router.route('/seats/:id').put((req, res) => {
    const { day, seat, client, email } = req.body;
    const seatIndex = db.seats.findIndex(s => s.id === parseInt(req.params.id));

    if (seatIndex !== -1) {
        if (day && seat && client && email) {
            db.seats[seatIndex] = { id: parseInt(req.params.id), day, seat, client, email };
            res.json({ message: 'OK', seat: db.seats[seatIndex] });
        } else {
            res.status(400).json({ message: 'Bad Request' });
        }
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});

router.route('/seats/:id').delete((req, res) => {
    const seatIndex = db.seats.findIndex(s => s.id === parseInt(req.params.id));

    if (seatIndex !== -1) {
        db.seats.splice(seatIndex, 1);
        res.json({ message: 'OK' });
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});

module.exports = router;
