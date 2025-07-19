const Route = require('../models/Route');

exports.getRoutes = async (req, res) => {
    try {
        const routes = await Route.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(routes);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.saveRoute = async (req, res) => {
    const { name, locations } = req.body;
    try {
        const newRoute = new Route({ name, locations, user: req.user.id });
        const route = await newRoute.save();
        res.json(route);
    } catch (err) { res.status(500).send('Server Error'); }
};

exports.deleteRoute = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        if (!route) return res.status(404).json({ msg: 'Route not found' });
        if (route.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
        await route.deleteOne();
        res.json({ msg: 'Route removed' });
    } catch (err) { res.status(500).send('Server Error'); }
};