const express = require("express");
const db = require("./../db");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");


router.route("/concerts").get((req, res) => {
  res.json(db.concerts);
});

router.route('/concerts/:id').get((req, res) => {
    const concertId = parseInt(req.params.id);
    const concert = db.concerts.find(c => c.id === concertId);
    if (concert) {
        res.json(concert);
    } else {
        res.status(404).json({ error: "Concert not found" });
    }
});

router.route('/concerts').post((req, res) => {
    const { performer, genre, price, day, image } = req.body;
    if (performer && genre && price && day && image) {
        const newId = db.concerts.length ? db.concerts[db.concerts.length - 1].id + 1 : 1;
        const newConcert = { id: newId, performer, genre, price, day, image };
        db.concerts.push(newConcert);
        res.json({ message: 'OK', concert: newConcert });
    } else {
        res.status(400).json({ message: 'Bad Request' });
    }
});
router.route('/concerts/:id').put((req, res) => {
    const { performer, genre, price, day, image } = req.body;
    const concertIndex = db.concerts.findIndex(c => c.id === parseInt(req.params.id));

    if (concertIndex !== -1) {
        if (performer && genre && price && day && image) {
            db.concerts[concertIndex] = { id: parseInt(req.params.id), performer, genre, price, day, image };
            res.json({ message: 'OK', concert: db.concerts[concertIndex] });
        } else {
            res.status(400).json({ message: 'Bad Request' });
        }
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});

router.route('/concerts/:id').delete((req, res) => {
    const concertIndex = db.concerts.findIndex(c => c.id === parseInt(req.params.id));

    if (concertIndex !== -1) {
        db.concerts.splice(concertIndex, 1);
        res.json({ message: 'OK' });
    } else {
        res.status(404).json({ message: 'Not found' });
    }
});

module.exports = router;
