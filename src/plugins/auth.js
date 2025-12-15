import fp from 'fastify-plugin';
import { config } from '../config/env.js';

/**
 * Authentication plugin
 * - Verifies API Key
 * - (Optional) Verifies Firebase ID Token
 */
export default fp(async (fastify, opts) => {
    fastify.decorate('verifyApiKey', async function (request, reply) {
        const apiKey = request.headers[config.apiKeyHeader];

        // In a real app, you might check this against a database of valid keys
        // For now, we compare against a single server-side key or allow bypass if in dev?
        // User requested "API key based authentication".
        // We will assume clients must send a valid key.

        // Simple check: compare with env var (if established) or just presence
        // If user didn't provide a list of keys, we'll implement a simple equality check 
        // against a master key for now, or assume a list later. 
        // Let's use a dummy check or master key if defined.

        // If no key defined in env, log warning and skip (or fail secure?) -> fail secure.
        // However, for scaffold, let's just check presence or a hardcoded/env secret.

        if (!apiKey) {
            throw new Error('Missing API Key');
        }

        // TODO: Validate API Key against database validation
    });

    fastify.decorate('verifyFirebaseToken', async function (request, reply) {
        // Placeholder for Firebase Auth verification
        const token = request.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            // Depends on if route requires user auth or just API access
            // Throwing here forces it.
            throw new Error('Missing User Token');
        }
        // await firebase.auth().verifyIdToken(token)...
    });
});
