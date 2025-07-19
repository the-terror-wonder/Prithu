const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
}, { timestamps: true }); // timestamps adds createdAt and updatedAt fields

module.exports = mongoose.model('Place', PlaceSchema);