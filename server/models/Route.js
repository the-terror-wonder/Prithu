const mongoose = require('mongoose');

const RouteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  // We're upgrading this field to store the full marker object
  locations: [{
    pos: {
      type: [Number], // Stores [lat, lng]
      required: true,
    },
    type: {
      type: String,
      default: 'current', // Stores 'saved', 'current', etc.
    }
  }],
}, { timestamps: true }); // This adds createdAt and updatedAt fields

module.exports = mongoose.model('Route', RouteSchema);