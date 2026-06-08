const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    rentalId: { type: String, required: true },
    email: { type: String, required: true },
    cameraName: { type: String, required: true },
    rentStart: { type: Date, required: true },
    rentEnd: { type: Date, required: true },
    renter: {
        name: { type: String, required: true },
        note: { type: String }
    },
    phone: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    payment: {
        method: {
            type: String,
            enum: ['Cash', 'Momo'],
            default: 'Cash'
        },
        status: {
            type: String,

            default: 'Pending'
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Rental', rentalSchema);
