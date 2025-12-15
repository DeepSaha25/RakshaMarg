# RakshaMarg Backend API

A Fastify-based Node.js backend for the RakshaMarg safety routing application.

## Features
- **Fastify Framework**: High performance Node.js web server.
- **Secure Routes**: API Key authentication enabled.
- **Rate Limiting**: Granular control over API usage.
- **Service Integrations**: 
  - Google Maps (Routes, Places)
  - Google Gemini (Safety Analysis)
  - Firebase (User Auth, Data Store)

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   GOOGLE_MAPS_API_KEY=your_maps_key
   GEMINI_API_KEY=your_gemini_key
   FIREBASE_PROJECT_ID=your_firebase_id
   FIREBASE_CLIENT_EMAIL=your_firebase_email
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
   ```

3. **Start Server**
   ```bash
   npm run dev
   ```

## API Endpoints

### `GET /api/v1/navigation/route`
Calculate the safest route between two points.

**Headers:**
- `x-api-key`: Your secure API Key.

**Query Params:**
- `origin`: Starting point (lat,lng or address).
- `destination`: End point (lat,lng or address).

**Response:**
```json
{
  "routes": [
    {
      "summary": "Route via Main St",
      "safetyAnalysis": {
         "safetyScore": 85,
         "riskFactors": ["Low lighting on sector 4"]
      }
    }
  ]
}
```
