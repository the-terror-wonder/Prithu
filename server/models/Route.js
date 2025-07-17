const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    locations: [{
        lat: { type: Number },
        lng: { type: Number }
    }]
});

module.exports = mongoose.model('Route', RouteSchema);