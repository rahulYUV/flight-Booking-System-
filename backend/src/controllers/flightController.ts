import { Request, Response } from 'express';
import Flight from '../models/Flight';

export const getFlights = async (req: Request, res: Response) => {
  try {
    const { source, destination, date, maxPrice, minSeats, sortBy } = req.query;

    let query: any = {};
    if (source) query.source = new RegExp(`^${source}$`, 'i');
    if (destination) query.destination = new RegExp(`^${destination}$`, 'i');
    
    if (date) {
      const searchDate = new Date(date as string);
      const nextDate = new Date(searchDate);
      nextDate.setDate(searchDate.getDate() + 1);
      
      query.departureTime = {
        $gte: searchDate,
        $lt: nextDate
      };
    }

    if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    if (minSeats) {
      query.availableSeats = { $gte: Number(minSeats) };
    }

    let sortOption: any = {};
    if (sortBy) {
      const [field, order] = (sortBy as string).split(':');
      sortOption[field] = order === 'desc' ? -1 : 1;
    }

    const flights = await Flight.find(query).sort(sortOption);
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createFlight = async (req: Request, res: Response) => {
  try {
    const flightData = req.body;

    const flightExists = await Flight.findOne({ flightNumber: flightData.flightNumber });
    if (flightExists) {
      return res.status(400).json({ message: 'Flight with that flight number already exists' });
    }

    const flight = await Flight.create(flightData);
    res.status(201).json(flight);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getFlightById = async (req: Request, res: Response) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (flight) {
      res.json(flight);
    } else {
      res.status(404).json({ message: 'Flight not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateFlight = async (req: Request, res: Response) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteFlight = async (req: Request, res: Response) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }
    res.json({ message: 'Flight successfully removed', flightId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
