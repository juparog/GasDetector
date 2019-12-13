const mongoose = require('mongoose');
const { Schema } = mongoose;

const MeasureSchema = new Schema({
    sensor_type: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Measure', MeasureSchema);