import { mapsService } from '../../services/mapsService.js';
import { geminiService } from '../../services/geminiService.js';
// import { firebaseService } from '../../services/firebase.js';

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

            return {
                ...route,
                safetyAnalysis
            };
        }));

        return {
            routes: analyzedRoutes,
            meta: {
                count: analyzedRoutes.length,
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
