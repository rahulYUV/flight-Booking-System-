import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  flightId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  passengerName: string;
  seatNumber: string;
  paymentStatus: string;
}

const BookingSchema: Schema = new Schema({
  flightId: { type: Schema.Types.ObjectId, ref: 'Flight', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  passengerName: { type: String, required: true },
  seatNumber: { type: String, required: true },
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Completed', 'Cancelled'], 
    default: 'Pending' 
  }
}, {
  timestamps: true
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
