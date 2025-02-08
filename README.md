# Placay

Discover *city highlights* and create *personalized itineraries*

## Prerequisites

Before starting, ensure you have the following installed:

* `Node.js` (version 16 or higher recommended)
* `npm` (usually bundled with Node.js)

## Getting Started

To set up and run Placay, follow these steps:

1. Clone the Repository
Ensure you have a local copy of the Sellio repository. Just clone it

2. Navigate to the `/server` directory to manage the backend, and the `/client` directory for the frontend

3. Do `npm install` on both directories

4. Make sure MongoDB is installed and running, you can get it with `brew services start mongodb-community@8.0` in Terminal on a Mac

5. Environment Variables:
  You need to create .env files for variables: `.env.development.local` and `.env.production.local`. For both there are example files `.env.development`and `.env.production`. Rename them and put in the needed information. for running backend ron`npm run build` then `npm run start`, for FE run `npm run dev`

1. Get a Google API Key (for Maps & Places API)

* Go to [Google Cloud Console](https://console.cloud.google.com/apis/dashboard)

* Create a new project (or select an existing one)
* Enable **Maps JavaScript API** & **Places API**
* Generate an **API Key** under Credentials
* Restrict the key (Domain/IP restriction recommended).
* Add it to `.env.production.local` and `.env.development.local` (backend only!): GOOGLE_MAPS_API_KEY= "your_Google_Maps_API_Key"

## Additional Notes

Linting: Use `npm run lint` to ensure your code matches to project standards
