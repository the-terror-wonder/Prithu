const axios = require('axios');

// This confirms the file is being read
console.log("SUCCESS: optimizationController.js has been loaded.");

// --- HELPER FOR API CALLS ---
const orsApi = axios.create({
    baseURL: 'https://api.openrouteservice.org',
    headers: {
        'Content-Type': 'application/json'
    }
});

// --- TSP ALGORITHM HELPERS ---
const calculateTotalDistance = (path, matrix) => {
    let distance = 0;
    for (let i = 0; i < path.length - 1; i++) {
        if (matrix[path[i]] && matrix[path[i]][path[i + 1]] !== undefined) {
            distance += matrix[path[i]][path[i + 1]];
        }
    }
    return distance;
};
const solveTspWith2Opt = (matrix) => {
    const numLocations = matrix.length;
    if (numLocations < 2) return [];
    let bestPath = [0];
    let visited = new Set(bestPath);
    let currentNode = 0;
    while (bestPath.length < numLocations) {
        let nearestNode = -1,
            minDistance = Infinity;
        for (let i = 0; i < numLocations; i++) {
            if (!visited.has(i) && matrix[currentNode][i] < minDistance) {
                minDistance = matrix[currentNode][i];
                nearestNode = i;
            }
        }
        if (nearestNode === -1) break;
        bestPath.push(nearestNode);
        visited.add(nearestNode);
        currentNode = nearestNode;
    }
    let improvement = true;
    while (improvement) {
        improvement = false;
        let currentBestDistance = calculateTotalDistance(bestPath, matrix);
        for (let i = 1; i < bestPath.length - 1; i++) {
            for (let j = i + 1; j < bestPath.length; j++) {
                const newPath = [...bestPath];
                const segment = newPath.slice(i, j + 1);
                segment.reverse();
                const finalPath = newPath.slice(0, i).concat(segment).concat(newPath.slice(j + 1));
                const newDistance = calculateTotalDistance(finalPath, matrix);
                if (newDistance < currentBestDistance) {
                    bestPath = finalPath;
                    currentBestDistance = newDistance;
                    improvement = true;
                }
            }
        }
    }
    return bestPath;
};

// --- API-FACING CONTROLLERS ---
exports.snapToRoad = async (req, res) => {
    const {
        lat,
        lng
    } = req.body;
    try {
        const response = await orsApi.get(`/geocode/reverse?point.lon=${lng}&point.lat=${lat}&layers=street&sources=osm`, {
            headers: {
                'Authorization': process.env.ORS_API_KEY
            }
        });
        if (response.data.features.length > 0) {
            const feature = response.data.features[0];
            const snappedLocation = feature.geometry.coordinates;
            const locationName = feature.properties.neighbourhood || feature.properties.name || feature.properties.label;
            res.json({
                location: snappedLocation,
                name: locationName
            });
        } else {
            res.status(404).json({
                msg: 'No match found'
            });
        }
    } catch (error) {
        res.status(500).send('ORS geocode service failed');
    }
};
exports.optimizeRoute = async (req, res) => {
    const {
        coordinates
    } = req.body;
    if (coordinates.length < 2) return res.status(400).json({
        msg: 'Need at least 2 coordinates'
    });
    const orsCoords = coordinates.map(c => [c[1], c[0]]);
    try {
        const matrixResponse = await orsApi.post('/v2/matrix/driving-car', {
            locations: orsCoords,
            metrics: ["duration"]
        }, {
            headers: {
                'Authorization': process.env.ORS_API_KEY
            }
        });
        const distanceMatrix = matrixResponse.data.durations;
        const optimizedOrder = solveTspWith2Opt(distanceMatrix);
        const orderedCoordinates = optimizedOrder.map(index => orsCoords[index]);
        const routeResponse = await orsApi.post('/v2/directions/driving-car/geojson', {
            coordinates: orderedCoordinates
        }, {
            headers: {
                'Authorization': process.env.ORS_API_KEY
            }
        });
        const routeData = routeResponse.data.features[0];
        res.json({
            routeGeometry: routeData.geometry,
            routeSummary: routeData.properties.summary,
            routeSegments: routeData.properties.segments,
            optimizedOrder
        });
    } catch (error) {
        console.error("Optimization Error:", error.response ? error.response.data : error.message);
        res.status(500).send('Optimization failed');
    }
};