'use strict'
const RentalService = require('../service/rental.service');


class RentalController {
    createRental = async (req, res) => {
        try {
            const rental = await RentalService.insertRental(req.body);
            res.status(201).json(rental);
        } catch (error) {
            res.status(400).json({ message: error.message });

        }
    };
    checkRental = async (req, res) => {
        try {
            const { cameraName, rentStart, rentEnd } = req.query;

            const rental = await RentalService.checkRental({ cameraName, rentStart, rentEnd });
            res.status(200).json(rental);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
    getAllRentals = async (req, res) => {
        try {
            const rentals = await RentalService.getAllRentals();
            res.status(200).json(rentals);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    getRentalById = async (req, res) => {
        try {
            const rental = await RentalService.getByID(req.params.id);
            if (!rental) return res.status(404).json({ message: 'Rental not found' });
            res.status(200).json(rental);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    updateRental = async (req, res) => {
        try {
            const rental = await RentalService.updateRental(req.params.id, req.body);
            if (!rental) return res.status(404).json({ message: 'Rental not found' });
            res.status(200).json(rental);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    };

    deleteRental = async (req, res) => {
        try {
            const rental = await RentalService.deleteRental(req.params.id);
            if (!rental) return res.status(404).json({ message: 'Rental not found' });
            res.status(200).json({ message: 'Rental deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };

    sendInvoiceEmail = async (req, res) => {
        try {
            console.log('Rental Data received:', req.body);
            const result = await RentalService.sendInvoiceEmail(req.body);
            res.status(200).json({ message: 'Email sent successfully', result });
        } catch (error) {
            console.error('Send Invoice Email Error:', error);
            res.status(500).json({ message: 'Failed to send email', error: error.message });
        }
    };

}

module.exports = new RentalController();
