const rentalModel = require('../models/rental.model');
const emailService = require('./email.service');

class RentalService {

    checkRental = async ({ cameraName, rentStart, rentEnd }) => {
        const exists = await rentalModel.findOne({
            cameraName,
            $or: [
                {
                    rentStart: { $lte: new Date(rentEnd) },
                    rentEnd: { $gte: new Date(rentStart) }
                }
            ]
        });
        if (exists) {
            throw new Error(`${cameraName} đã được đặt từ ${exists.rentStart.toLocaleDateString()} đến ${exists.rentEnd.toLocaleDateString()}`);
        }
        return true;
    }
    insertRental = async (rental) => {
        // const { cameraName, rentStart, rentEnd } = rental;

        // const exists = await rentalModel.findOne({
        //     cameraName,
        //     $or: [
        //         {
        //             rentStart: { $lte: new Date(rentEnd) },
        //             rentEnd: { $gte: new Date(rentStart) }
        //         }
        //     ]
        // });

        // if (exists) {
        //     throw new Error(` ${cameraName} đã được đặt trước đó ${exists.rentStart.toLocaleDateString()} tới ${exists.rentEnd.toLocaleDateString()}`);
        // }

        if (rental.rentalId) {
            const existing = await rentalModel.findOne({ rentalId: rental.rentalId });
            if (existing) {
                console.log(`Rental ${rental.rentalId} already exists, returning existing record.`);
                return existing;
            }
        }

        const newRental = await rentalModel.create(rental);

        try {
            // Tự động gửi email hóa đơn khi tạo đơn mới thành công
            await emailService.sendInvoiceEmail(newRental.toObject());
            console.log(`Automatic invoice email sent for rental ${newRental.rentalId} to ${newRental.email}`);
        } catch (emailErr) {
            console.error(`Failed to send automatic invoice email for rental ${newRental.rentalId}:`, emailErr.message);
        }

        return newRental;
    }
    deleteRental = async (rentalId) => {
        return await rentalModel.findByIdAndDelete(rentalId);
    }
    updateRental = async (rentalId, rental) => {
        const currentRental = await rentalModel.findById(rentalId);
        if (!currentRental) return null;

        const cameraName = rental.cameraName || currentRental.cameraName;
        const rentStart = rental.rentStart || currentRental.rentStart;
        const rentEnd = rental.rentEnd || currentRental.rentEnd;

        const exists = await rentalModel.findOne({
            _id: { $ne: rentalId },
            cameraName,
            $or: [
                {
                    rentStart: { $lte: new Date(rentEnd) },
                    rentEnd: { $gte: new Date(rentStart) }
                }
            ]
        });

        if (exists) {
            throw new Error(`Camera ${cameraName} is already rented from ${exists.rentStart.toLocaleDateString()} to ${exists.rentEnd.toLocaleDateString()}`);
        }

        return await rentalModel.findByIdAndUpdate(rentalId, { $set: rental }, { new: true })
    }
    getAllRentals = async () => {
        return await rentalModel.find();
    }
    getByID = async (rentalId) => {
        return await rentalModel.findById(rentalId);
    }
    sendInvoiceEmail = async (rentalData) => {
        return await emailService.sendInvoiceEmail(rentalData);
    }
    updateRentalByRentalId = async (rentalId, updateData) => {
        return await rentalModel.findOneAndUpdate(
            { rentalId: rentalId },
            updateData,
            { new: true }
        );
    }
    updatePaymentStatus = async (rentalId, paymentData) => {
        return await rentalModel.findOneAndUpdate(
            { rentalId: rentalId },
            { $set: paymentData },
            { new: true }
        );
    }
}
module.exports = new RentalService();