import { Request, Response } from 'express';
import Flight from '../models/Flight';

export const getFlights = async (req: Request, res: Response) => {
  try {
    const { source, destination, date, maxPrice, minSeats, sortBy, airline, cabinClass, stops, amenities, page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

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

    if (airline) {
      query.airline = new RegExp(`^${airline}$`, 'i');
    }

    if (cabinClass) {
      query.cabinClass = cabinClass;
    }

    if (stops !== undefined) {
      query.stops = Number(stops);
    }

    if (amenities) {
      const amenitiesList = (amenities as string).split(',');
      query.amenities = { $all: amenitiesList };
    }

    let sortOption: any = {};
    if (sortBy) {
      const [field, order] = (sortBy as string).split(':');
      sortOption[field] = order === 'desc' ? -1 : 1;
    }

    const flights = await Flight.find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .skip(skip);

    const total = await Flight.countDocuments(query);

    res.json({
      flights,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createFlight = async (req: Request, res: Response) => {
  try {
    const flightData = { ...req.body };

    const flightExists = await Flight.findOne({ flightNumber: flightData.flightNumber });
    if (flightExists) {
      return res.status(400).json({ message: 'Flight with that flight number already exists' });
    }

    // Calculate duration automatically if missing
    if (!flightData.duration && flightData.departureTime && flightData.arrivalTime) {
      const start = new Date(flightData.departureTime).getTime();
      const end = new Date(flightData.arrivalTime).getTime();
      flightData.duration = Math.round((end - start) / (1000 * 60));
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

export const searchTrips = async (req: Request, res: Response) => {
  try {
    const { source, destination, departureDate, returnDate, cabinClass, stops } = req.query;

    if (!source || !destination || !departureDate) {
      return res.status(400).json({ message: 'Source, destination, and departureDate are required' });
    }

    // Outbound Search (Source -> Destination)
    let outboundQuery: any = {
      source: new RegExp(`^${source}$`, 'i'),
      destination: new RegExp(`^${destination}$`, 'i'),
    };

    const depDate = new Date(departureDate as string);
    const nextDepDate = new Date(depDate);
    nextDepDate.setDate(depDate.getDate() + 1);
    outboundQuery.departureTime = { $gte: depDate, $lt: nextDepDate };

    if (cabinClass) outboundQuery.cabinClass = cabinClass;
    if (stops !== undefined) outboundQuery.stops = Number(stops);

    const outboundFlights = await Flight.find(outboundQuery).lean();

    // Return Search (Destination -> Source)
    let inboundFlights: any[] = [];
    if (returnDate) {
      let inboundQuery: any = {
        source: new RegExp(`^${destination}$`, 'i'),
        destination: new RegExp(`^${source}$`, 'i'),
      };

      const retDate = new Date(returnDate as string);
      const nextRetDate = new Date(retDate);
      nextRetDate.setDate(retDate.getDate() + 1);
      inboundQuery.departureTime = { $gte: retDate, $lt: nextRetDate };

      if (cabinClass) inboundQuery.cabinClass = cabinClass;
      if (stops !== undefined) inboundQuery.stops = Number(stops);

      inboundFlights = await Flight.find(inboundQuery).lean();
    }

    // Price and Duration Ranking
    const processRankings = (flights: any[]) => {
      if (flights.length === 0) return flights;
      const minPrice = Math.min(...flights.map(f => f.price));
      const minDuration = Math.min(...flights.map(f => f.duration));
      return flights.map(f => ({
        ...f,
        isCheapest: f.price === minPrice,
        isFastest: f.duration === minDuration
      }));
    };

    res.json({
      outbound: processRankings(outboundFlights),
      inbound: processRankings(inboundFlights),
      tripType: returnDate ? 'Round-trip' : 'One-way'
    });

  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
