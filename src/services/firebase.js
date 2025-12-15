import admin from 'firebase-admin';
import { config } from '../config/env.js';

// Initialize Firebase only if config is present
if (config.firebase.projectId && config.firebase.privateKey) {
    admin.initializeApp({
        credential: admin.credential.cert(config.firebase)
    });
} else {
    console.warn('Firebase config missing. Auth and DB features will be disabled.');
}

export const db = admin.firestore ? admin.firestore() : null;
export const auth = admin.auth ? admin.auth() : null;

export const firebaseService = {
    async logSOSEvent(userId, location, timestamp) {
        if (!db) return;
        return db.collection('sos_events').add({ userId, location, timestamp });
    },

    async getCrimeData(bbox) {
        // Spatial query placeholder
        return [];
    }
};
