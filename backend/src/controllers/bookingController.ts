import { Response } from 'express';
import Booking from '../models/Booking';
import Flight from '../models/Flight';
import { AuthRequest } from '../middleware/authMiddleware';

export const createBooking = async (req: AuthRequest, res: Response) => {
  const { flightId, passengerName, seatNumber, paymentStatus } = req.body;

  try {
    if (!flightId || !passengerName || !seatNumber) {
      return res.status(400).json({ message: 'Invalid data provided' });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    if (flight.availableSeats < 1) {
      return res.status(400).json({ message: 'No seats available for this flight' });
    }

    const booking = await Booking.create({
      flightId,
      userId: req.user._id,
      passengerName,
      seatNumber,
      paymentStatus: paymentStatus || 'Pending'
    });

    flight.availableSeats -= 1;
    await flight.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).populate('flightId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized action' });
    }

    if (booking.paymentStatus === 'Cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.paymentStatus = 'Cancelled';
    await booking.save();

    const flight = await Flight.findById(booking.flightId);
    if (flight) {
      flight.availableSeats += 1;
      await flight.save();
    }

    res.json({ message: 'Booking successfully cancelled' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
