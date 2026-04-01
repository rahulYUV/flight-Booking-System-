import { Request, Response } from 'express';
import { getLiveFlightStatus } from '../services/liveFlightService';

export const getLiveStatus = async (req: Request, res: Response) => {
  const { flightNumber } = req.params;

  if (!flightNumber) {
    return res.status(400).json({ message: 'Flight number is required for live tracking' });
  }

  try {
    const flightData = await getLiveFlightStatus(flightNumber);

    if (flightData && flightData.length > 0) {
      // Find the most recent/currently flying instance
      const currentFlight = flightData[0]; 
      
      res.json({
        flight_status: currentFlight.flight_status,
        departure: currentFlight.departure,
        arrival: currentFlight.arrival,
        live: currentFlight.live || null,
        airline: currentFlight.airline,
        flight: currentFlight.flight
      });
    } else {
      res.status(404).json({ message: 'No live tracking data found for this flight' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
