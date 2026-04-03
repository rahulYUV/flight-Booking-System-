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
        departure: {
          iata: currentFlight.departure.iata,
          city: currentFlight.departure.city,
          scheduled: currentFlight.departure.scheduled,
          estimated: currentFlight.departure.estimated,
          terminal: currentFlight.departure.terminal,
          gate: currentFlight.departure.gate
        },
        arrival: {
          iata: currentFlight.arrival.iata,
          city: currentFlight.arrival.city,
          scheduled: currentFlight.arrival.scheduled,
          estimated: currentFlight.arrival.estimated,
          terminal: currentFlight.arrival.terminal,
          gate: currentFlight.arrival.gate
        },
        live: currentFlight.live || null,
        airline: currentFlight.airline,
        flight: currentFlight.flight,
        aircraft: currentFlight.aircraft || null,
        delay: {
          departure: currentFlight.departure.delay || 0,
          arrival: currentFlight.arrival.delay || 0
        }
      });
    } else {
      res.status(404).json({ message: 'No live tracking data found for this flight' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
