import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const GOOGLE_MAPS_API_URL = 'https://maps.googleapis.com/maps/api/directions/json';

export const getOptimizedRoute = async (origin, destination) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY; // Your Google Maps API Key

  try {
    const response = await axios.get(GOOGLE_MAPS_API_URL, {
      params: {
        origin: origin,           // Origin address or coordinates
        destination: destination, // Destination address or coordinates
        key: apiKey,              // API key for Google Maps API
      },
    });

    if (response.data.routes && response.data.routes.length > 0) {
      return response.data.routes[0]; // Optimized route
    } else {
      throw new Error('No route found.');
    }
  } catch (error) {
    console.error('Error fetching optimized route:', error);
    throw new Error('Error fetching optimized route.');
  }
};
