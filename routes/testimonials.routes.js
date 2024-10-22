const express = require('express');
const router = express.Router();
const TestimonialController = require('../controllers/testimonials.controller');


router.get("/testimonials", TestimonialController.getAll);
router.get("/testimonials/random", TestimonialController.getRandom);
router.get("/testimonials/:id", TestimonialController.getById);
router.post("/testimonials", TestimonialController.post);
router.put("/testimonials/:id", TestimonialController.putById);
router.delete("/testimonials/:id", TestimonialController.delete);



module.exports = router;
