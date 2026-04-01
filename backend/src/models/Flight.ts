import mongoose, { Schema, Document } from 'mongoose';

export interface IFlight extends Document {
  flightNumber: string;
  airline: string;
  airlineLogo: string;
  source: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;
  duration: number; // Duration in minutes
  price: number;
  availableSeats: number;
  stops: number;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business' | 'First';
  amenities: string[];
  isRefundable: boolean;
  status: 'Scheduled' | 'Delayed' | 'Cancelled';
  baggageInfo: {
    carryOn: string;
    checked: string;
  };
}

const FlightSchema: Schema = new Schema({
  flightNumber: { type: String, required: true, unique: true },
  airline: { type: String, required: true },
  airlineLogo: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  duration: { type: Number, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  stops: { type: Number, default: 0 },
  cabinClass: { 
    type: String, 
    required: true, 
    enum: ['Economy', 'Premium Economy', 'Business', 'First'],
    default: 'Economy'
  },
  amenities: [{ type: String }],
  isRefundable: { type: Boolean, default: false },
  status: { 
    type: String, 
    enum: ['Scheduled', 'Delayed', 'Cancelled'], 
    default: 'Scheduled' 
  },
  baggageInfo: {
    carryOn: { type: String, default: '7kg' },
    checked: { type: String, default: '15kg' }
  }
}, {
  timestamps: true
});


export default mongoose.model<IFlight>('Flight', FlightSchema);
