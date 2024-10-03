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

router.route("/seats").post((req, res) => {
    const { day, seat, client, email } = req.body;
    if (!day || !seat || !client || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const isSeatTaken = db.seats.some(
        (existingSeat) => existingSeat.day === day && existingSeat.seat === seat
    );
    if (isSeatTaken) {
        return res.status(409).json({ message: "The slot is already taken..." });
    }

    const newSeat = {
        id: uuidv4(),
        day,
        seat,
        client,
        email,
    };
    db.seats.push(newSeat);
    req.io.emit("seatsUpdated", db.seats);  // Emitowanie aktualizacji do wszystkich połączonych klientów
    return res.status(201).json(newSeat); // Możesz również zwrócić nowo utworzony obiekt
});
  
router.route('/seats/:id').put((req, res) => {
    const { day, seat, client, email } = req.body;
    const seatIndex = db.seats.findIndex(s => s.id === parseInt(req.params.id));

    if (seatIndex !== -1) {
        if (day && seat && client && email) {
            db.seats[seatIndex] = { id: parseInt(req.params.id), day, seat, client, email };
            return res.json({ message: 'OK', seat: db.seats[seatIndex] });
        } else {
            return res.status(400).json({ message: 'Bad Request' });
        }
    } else {
        return res.status(404).json({ message: 'Not found' });
    }
});

router.route('/seats/:id').delete((req, res) => {
    const seatIndex = db.seats.findIndex(s => s.id === parseInt(req.params.id));

    if (seatIndex !== -1) {
        db.seats.splice(seatIndex, 1);
        return res.json({ message: 'OK' });
    } else {
        return res.status(404).json({ message: 'Not found' });
    }
});

module.exports = router;
