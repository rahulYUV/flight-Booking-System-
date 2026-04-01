import axios from 'axios';

const AVIATIONSTACK_BASE_URL = 'http://api.aviationstack.com/v1';

export const getLiveFlightStatus = async (flightNumber: string) => {
  const apiKey = process.env.AVIATIONSTACK_KEY;
  
  if (!apiKey) {
    throw new Error('AVIATIONSTACK_KEY is not defined in environment variables');
  }

  try {
    const response = await axios.get(`${AVIATIONSTACK_BASE_URL}/flights`, {
      params: {
        access_key: apiKey,
        flight_iata: flightNumber
      }
    });

    // Aviationstack returns an array under 'data'
    return response.data.data;
  } catch (error) {
    console.error('Aviationstack API Error:', error);
    throw new Error('Failed to fetch live flight status');
  }
};
