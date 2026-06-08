const express = require('express');
const router = express.Router();
const rentalController = require('../../controllers/rental.controller');

router.post('/insertRental', rentalController.createRental);
router.get('/getAllRentals', rentalController.getAllRentals);
router.get('/getByID/:id', rentalController.getRentalById);
router.put('/updateRental/:id', rentalController.updateRental);
router.delete('/deleteRental/:id', rentalController.deleteRental);
router.get('/checkRental', rentalController.checkRental);
router.post('/sendInvoiceEmail', rentalController.sendInvoiceEmail);

module.exports = router;
