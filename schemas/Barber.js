const mongoose = require("mongoose");

const barberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
});

const Barber = mongoose.model("Barber", barberSchema);

module.exports = Barber
