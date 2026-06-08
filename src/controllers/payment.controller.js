"use strict";

const MomoService = require('../service/momo.service');
const RentalService = require('../service/rental.service');

class PaymentController {
    createMomoPayment = async (req, res) => {
        try {
            const { rentalId } = req.body;
            console.log("createMomoPayment", req.body);
            if (!rentalId) {
                return res.status(400).json({ message: 'rentalId is required' });
            }
            const amount = req.body.totalPrice.toString() + "0";
            const orderId = `${rentalId}_${Date.now()}`;
            const orderInfo = `Thanh toán thuê máy: ${req.body.cameraName}`;
            const requestId = orderId;

            const redirectUrl = process.env.MOMO_REDIRECT_URL || 'http://localhost:3000/payment-status';
            const ipnUrl = process.env.MOMO_IPN_URL || `${req.protocol}://${req.get('host')}/api/payment/momo/ipn`;
            
            // Pass the entire rental details in extraData so we can construct it during callback/redirect
            const extraData = Buffer.from(JSON.stringify(req.body)).toString('base64');

            const paymentData = await MomoService.createPayment({
                amount,
                orderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                requestId,
                extraData
            });
            res.status(200).json(paymentData);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    momoIPN = async (req, res) => {
        try {

            const { orderId, resultCode, extraData } = req.body;
            console.log("MoMo IPN Body:", req.body);
            if (Number(resultCode) === 0) {
                let rentalId = orderId.substring(0, orderId.lastIndexOf('_'));
                if (!rentalId) rentalId = orderId; // Fallback in case there is no underscore

                console.log("rentalId parsed for IPN:", rentalId);
                await RentalService.updatePaymentStatus(rentalId, {
                    'payment.status': 'Paid',
                    'payment.method': 'Momo'
                });
                console.log(`Rental ${rentalId} updated to Paid via MoMo IPN`);
            } else {
                console.log(`MoMo Payment failed for order ${orderId} with code ${resultCode}`);
            }

            // MoMo requires a 200 response
            res.sendStatus(200);
        } catch (error) {
            console.error('MoMo IPN Error:', error.message);
            res.status(500).json({ message: error.message });
        }
    };
}

module.exports = new PaymentController();
