import { Response } from 'express';
import Booking from '../models/Booking';
import Flight from '../models/Flight';
import { AuthRequest } from '../middleware/authMiddleware';

export const createBooking = async (req: AuthRequest, res: Response) => {
  const { flightId, passengerName, seatNumber, mealPreference } = req.body;

  try {
    // 1. Attempt to decrement seat atomically
    const flight = await Flight.findOneAndUpdate(
      { _id: flightId, availableSeats: { $gt: 0 } },
      { $inc: { availableSeats: -1 } },
      { new: true }
    );

    if (!flight) {
      // Either flight not found OR no seats left
      const exists = await Flight.findById(flightId);
      if (!exists) return res.status(404).json({ message: 'Flight not found' });
      return res.status(400).json({ message: 'No seats available for this flight' });
    }

    // 2. Create the booking record
    const booking = await Booking.create({
      flightId,
      userId: req.user._id,
      passengerName,
      seatNumber,
      mealPreference: mealPreference || 'None',
      totalPrice: flight.price,
      paymentStatus: 'Completed',
      bookingStatus: 'Confirmed'
    });

    res.status(201).json(booking);

  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('flightId')
      .sort({ createdAt: -1 }); // Show newest first
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    // Update Status atomically to prevent double cancellation
    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id, bookingStatus: 'Confirmed' },
      { bookingStatus: 'Cancelled', paymentStatus: 'Refunded' },
      { new: true }
    );

    if (!updatedBooking) {
      // Check if it exists but is already cancelled
      const alreadyCancelled = await Booking.findById(req.params.id);
      if (alreadyCancelled && alreadyCancelled.bookingStatus === 'Cancelled') {
        return res.status(400).json({ message: 'Booking is already cancelled' });
      }
      return res.status(404).json({ message: 'Booking not found or unauthorized' });
    }

    // Refund Seat atomically
    await Flight.findByIdAndUpdate(updatedBooking.flightId, { $inc: { availableSeats: 1 } });

    res.json({ message: 'Booking successfully cancelled and seat refunded' });

  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
