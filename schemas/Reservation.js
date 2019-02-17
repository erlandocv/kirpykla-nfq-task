const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    time: {
        type: Date, 
        required: true,
    },

    barber: { type: mongoose.Types.ObjectId, ref: 'Barber' }
});

const Reservation = mongoose.model("Reservation", reservationSchema);

module.exports = Reservation
