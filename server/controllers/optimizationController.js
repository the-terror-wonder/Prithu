const axios = require('axios');

// TSP Solver (Nearest Neighbor)
const solveTsp = (matrix) => {
    // ... (This function remains unchanged)
    const numLocations = matrix.length;
    let path = [0], visited = new Set(path), currentNode = 0;
    while (path.length < numLocations) {
        let nearestNode = -1, minDistance = Infinity;
        for (let i = 0; i < numLocations; i++) {
            if (!visited.has(i) && matrix[currentNode][i] < minDistance) {
                minDistance = matrix[currentNode][i];
                nearestNode = i;
            }
        }
        if (nearestNode === -1) break; // All reachable nodes visited
        path.push(nearestNode);
        visited.add(nearestNode);
        currentNode = nearestNode;
    }
    return path;
};

exports.optimizeRoute = async (req, res) => {
    const { coordinates } = req.body;
    if (!coordinates || coordinates.length < 2) {
        return res.status(400).json({ msg: 'At least 2 coordinates are required.' });
    }
    try {
        // STEP 1: Get the distance matrix (same as before)
        const locationsForMatrix = coordinates.map(c => `${c[1]},${c[0]}`).join(';');
        const matrixUrl = `http://router.project-osrm.org/table/v1/driving/${locationsForMatrix}`;
        const osrmMatrixResponse = await axios.get(matrixUrl);
        const distanceMatrix = osrmMatrixResponse.data.durations;
        
        // STEP 2: Solve TSP to get the optimal order (same as before)
        const optimizedOrder = solveTsp(distanceMatrix);
        const orderedCoordinates = optimizedOrder.map(index => coordinates[index]);

        // STEP 3 (NEW): Get the actual road geometry from OSRM's 'route' service
        const locationsForRoute = orderedCoordinates.map(c => `${c[1]},${c[0]}`).join(';');
        const routeUrl = `http://router.project-osrm.org/route/v1/driving/${locationsForRoute}?overview=full&geometries=geojson`;
        const osrmRouteResponse = await axios.get(routeUrl);
        const routeGeometry = osrmRouteResponse.data.routes[0].geometry;

        // Send the detailed geometry back to the client
        res.json({ routeGeometry });

    } catch (error) {
        console.error("Optimization Error:", error.message);
        res.status(500).send('OSRM or optimization error');
    }
};

exports.snapToRoad = async (req, res) => {
    const { lat, lng } = req.body;
    try {
        const url = `http://router.project-osrm.org/nearest/v1/driving/${lng},${lat}`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).send('OSRM nearest service failed');
    }
};