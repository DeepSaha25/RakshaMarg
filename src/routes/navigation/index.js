import { mapsService } from '../../services/mapsService.js';
import { geminiService } from '../../services/geminiService.js';
// import { firebaseService } from '../../services/firebase.js';

// Calculate deterministic safety score based on API data
function calculateSafetyScore(crimeData, nearbyPlaces, lightingCondition, crowdLevel, timeOfDay) {
    let score = 0;

    // Crime Risk (0-30 points)
    const crimeCount = crimeData?.length || 0;
    if (crimeCount === 0) {
        score += 30; // Low crime
    } else if (crimeCount <= 3) {
        score += 20; // Medium crime
    } else {
        score += 10; // High crime
    }

    // Street Lighting (0-25 points)
    const lighting = String(lightingCondition).toLowerCase();
    if (lighting === 'well-lit' || lighting === 'good' || lighting === 'true') {
        score += 25;
    } else if (lighting === 'partial' || lighting === 'moderate') {
        score += 15;
    } else {
        score += 5; // Poor lighting
    }

    // Crowd / Activity (0-20 points)
    const activePlaces = nearbyPlaces?.activePlaces?.length || 0;
    const crowd = crowdLevel || activePlaces;
    if (crowd >= 5) {
        score += 20; // High activity
    } else if (crowd >= 2) {
        score += 12; // Moderate activity
    } else {
        score += 5; // Isolated
    }

    // Nearby Help (0-15 points)
    const policeCount = nearbyPlaces?.police?.length || 0;
    const hospitalCount = nearbyPlaces?.hospitals?.length || 0;
    if (policeCount > 0 && hospitalCount > 0) {
        score += 15; // Both nearby
    } else if (policeCount > 0 || hospitalCount > 0) {
        score += 10; // Either one nearby
    } else {
        score += 3; // None nearby
    }

    // Time of Day (0-10 points)
    const time = String(timeOfDay).toLowerCase();
    if (time === 'day' || time === 'morning' || time === 'afternoon') {
        score += 10;
    } else if (time === 'evening' || time === 'dusk') {
        score += 6;
    } else {
        score += 2; // Late night
    }

    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, score));
}

// Fallback scoring when API data is unavailable
function calculateFallbackScore(distanceMeters, durationSeconds) {
    let score = 70; // Base score

    // Penalize long distance routes
    // Distance penalty: -1 point per 2km over 5km
    if (distanceMeters > 5000) {
        const excessKm = (distanceMeters - 5000) / 1000;
        const distancePenalty = Math.floor(excessKm / 2);
        score -= distancePenalty;
    }

    // Penalize long duration routes
    // Duration penalty: -1 point per 5 minutes over 15 minutes
    if (durationSeconds > 900) {
        const excessMinutes = (durationSeconds - 900) / 60;
        const durationPenalty = Math.floor(excessMinutes / 5);
        score -= durationPenalty;
    }

    // Small bonus for short AND fast routes
    // Bonus: +5 points if distance < 3km AND duration < 10 minutes
    if (distanceMeters < 3000 && durationSeconds < 600) {
        score += 5;
    }

    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, score));
}

export default async function (fastify, opts) {

    // GET /route - Calculate safest route
    fastify.get('/route', {
        // Define schema for validation and documentation
        schema: {
            querystring: {
                type: 'object',
                required: ['origin', 'destination'],
                properties: {
                    origin: { type: 'string' }, // "lat,lng" or "Address"
                    destination: { type: 'string' }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        routes: { type: 'array' },
                        meta: { type: 'object' }
                    }
                }
            }
        },
        // Attach auth hooks if needed
        onRequest: [fastify.verifyApiKey]
    }, async (request, reply) => {
        const { origin, destination } = request.query;

        // 1. Fetch Routes from Google Maps
        const routes = await mapsService.getRoutes(origin, destination);

        // 2. Enhance with Safety Data (Parallelize if needed)
        // For each route, we would ideally fetch nearby safety factors
        // This is computationally heavy, so in production we'd optimize or cache.

        const analyzedRoutes = await Promise.all(routes.map(async (route) => {
            // Mock data for places and crime
            const nearbyPlaces = []; // await mapsService.getNearbyPlaces(...)
            const crimeStats = []; // await firebaseService.getCrimeData(...)

            // 3. Analyze with Gemini
            // Doing this for *every* route might be slow/costly. 
            // Strategy: Select top 3 routes, or analyze asynchronously. 
            // For scaffold, we analyze the primary route or return placeholder.

            const safetyAnalysis = await geminiService.analyzeSafety(route, crimeStats);

            // Determine time of day
            const currentHour = new Date().getHours();
            let timeOfDay = 'night';
            if (currentHour >= 6 && currentHour < 18) {
                timeOfDay = 'day';
            } else if (currentHour >= 18 && currentHour < 21) {
                timeOfDay = 'evening';
            }

            // Decide which scoring model to use
            const hasCrimeData = crimeStats && crimeStats.length > 0;
            const hasPlacesData = nearbyPlaces && (
                (nearbyPlaces.police && nearbyPlaces.police.length > 0) ||
                (nearbyPlaces.hospitals && nearbyPlaces.hospitals.length > 0) ||
                (nearbyPlaces.activePlaces && nearbyPlaces.activePlaces.length > 0)
            );

            let safetyScore;
            let modelUsed;

            if (hasCrimeData || hasPlacesData) {
                // Use full safety scoring
                safetyScore = calculateSafetyScore(
                    crimeStats,
                    nearbyPlaces,
                    route.lightingCondition || 'unknown',
                    route.crowdLevel || 0,
                    timeOfDay
                );
                modelUsed = 'full';
            } else {
                // Use fallback scoring
                safetyScore = calculateFallbackScore(
                    route.distanceMeters || 0,
                    route.durationSeconds || 0
                );
                modelUsed = 'fallback';
            }

            // Assign color based on safety score
            let safetyColor = 'red';
            if (safetyScore >= 71) {
                safetyColor = 'green';
            } else if (safetyScore >= 41) {
                safetyColor = 'yellow';
            }

            return {
                ...route,
                safetyAnalysis,
                safetyScore,
                safetyColor,
                modelUsed
            };
        }));

        // Sort routes by safety score (highest first)
        const sortedRoutes = analyzedRoutes.sort((a, b) => {
            const scoreA = a.safetyScore || 0;
            const scoreB = b.safetyScore || 0;
            return scoreB - scoreA;
        });

        // Select the safest route
        const safestRoute = sortedRoutes.length > 0 ? sortedRoutes[0] : null;

        return {
            safestRoute,
            routes: sortedRoutes,
            meta: {
                count: sortedRoutes.length,
                provider: 'Google Maps + Gemini'
            }
        };
    });

    // POST /sos - Trigger SOS
    fastify.post('/sos', {
        onRequest: [fastify.verifyApiKey] // And maybe verifyFirebaseToken
    }, async (request, reply) => {
        // Logic to handle SOS
        return { status: 'SOS Triggered' };
    });
}
