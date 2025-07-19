const Place = require('../models/Place');

// Get all saved places for the logged-in user
exports.getPlaces = async (req, res) => {
    try {
        const places = await Place.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(places);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// Add this new function to placeController.js
exports.deletePlace = async (req, res) => {
    try {
        const place = await Place.findById(req.params.id);

        if (!place) {
            return res.status(404).json({ msg: 'Place not found' });
        }

        // Make sure user owns the place
        if (place.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await place.deleteOne();
        res.json({ msg: 'Place removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// Save a new place for the logged-in user
exports.savePlace = async (req, res) => {
    const { name, location } = req.body;
    try {
        const newPlace = new Place({
            name,
            location,
            user: req.user.id,
        });
        const place = await newPlace.save();
        res.json(place);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};