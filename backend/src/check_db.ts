import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const FlightSchema = new mongoose.Schema({
  source: String,
  destination: String,
  departureTime: Date
});

const Flight = mongoose.model('Flight', FlightSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connected to DB');
    
    const count = await Flight.countDocuments();
    console.log(`Total flights: ${count}`);
    
    const patnaFlights = await Flight.find({ 
      $or: [
        { source: /Patna/i },
        { destination: /Patna/i }
      ]
    });
    
    console.log(`Flights involving Patna: ${patnaFlights.length}`);
    if (patnaFlights.length > 0) {
      console.log('Sample Patna flight:', JSON.stringify(patnaFlights[0], null, 2));
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

check();
