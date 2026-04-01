import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  flightId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  passengerName: string;
  seatNumber: string;
  mealPreference: 'Veg' | 'Non-Veg' | 'None';
  totalPrice: number;
  paymentStatus: 'Pending' | 'Completed' | 'Refunded';
  bookingStatus: 'Confirmed' | 'Cancelled';
}

const BookingSchema: Schema = new Schema({
  flightId: { type: Schema.Types.ObjectId, ref: 'Flight', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  passengerName: { type: String, required: true },
  seatNumber: { type: String, required: true },
  mealPreference: { 
    type: String, 
    enum: ['Veg', 'Non-Veg', 'None'], 
    default: 'None' 
  },
  totalPrice: { type: Number, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Refunded'], 
    default: 'Pending' 
  },
  bookingStatus: {
    type: String,
    enum: ['Confirmed', 'Cancelled'],
    default: 'Confirmed'
  }
}, {
  timestamps: true
});


export default mongoose.model<IBooking>('Booking', BookingSchema);
