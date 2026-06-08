"use strict";

const express = require('express');
const router = express.Router();
const PaymentController = require('../../controllers/payment.controller');

router.post('/momo/create', PaymentController.createMomoPayment);
router.post('/momo/ipn', PaymentController.momoIPN);

module.exports = router;
