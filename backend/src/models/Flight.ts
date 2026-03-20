import mongoose, { Schema, Document } from 'mongoose';

export interface IFlight extends Document {
  flightNumber: string;
  airline: string;
  source: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
  availableSeats: number;
}

const FlightSchema: Schema = new Schema({
  flightNumber: { type: String, required: true, unique: true },
  airline: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IFlight>('Flight', FlightSchema);
