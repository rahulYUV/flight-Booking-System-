import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Flight from './models/Flight';
import User from './models/User';
import Booking from './models/Booking';
import connectDB from './config/db';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // Clear out any old data from testing
    await Flight.deleteMany();
    await User.deleteMany();
    await Booking.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('123456', salt);

    const createdUsers = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@indigo.com',
        passwordHash,
      },
      {
        name: 'Test Passenger',
        email: 'test@example.com',
        passwordHash,
      }
    ]);

    const flights = [
      {
        flightNumber: '6E-101',
        airline: 'IndiGo',
        airlineLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/IndiGo_Airlines_logo.svg/1200px-IndiGo_Airlines_logo.svg.png',
        source: 'Delhi (DEL)',
        destination: 'Mumbai (BOM)',
        departureTime: new Date(new Date().setHours(10, 0, 0, 0) + 24 * 60 * 60 * 1000), 
        arrivalTime: new Date(new Date().setHours(12, 15, 0, 0) + 24 * 60 * 60 * 1000),
        duration: 135,
        price: 5500,
        availableSeats: 180,
        stops: 0,
        cabinClass: 'Economy',
        amenities: ['Veg Meal', 'Extra Legroom', 'USB Power'],
        isRefundable: false,
        baggageInfo: { carryOn: '7kg', checked: '15kg' }
      },
      {
        flightNumber: 'AI-802',
        airline: 'Air India',
        airlineLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Air_India_Logo_2023.svg/1200px-Air_India_Logo_2023.svg.png',
        source: 'Mumbai (BOM)',
        destination: 'Bangalore (BLR)',
        departureTime: new Date(new Date().setHours(14, 30, 0, 0) + 48 * 60 * 60 * 1000),
        arrivalTime: new Date(new Date().setHours(16, 15, 0, 0) + 48 * 60 * 60 * 1000),
        duration: 105,
        price: 7200,
        availableSeats: 150,
        stops: 0,
        cabinClass: 'Business',
        amenities: ['Premium Dining', 'Flat Bed', 'Priority Boarding', 'WiFi'],
        isRefundable: true,
        baggageInfo: { carryOn: '10kg', checked: '35kg' }
      },
      {
        flightNumber: 'UK-950',
        airline: 'Vistara',
        airlineLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Vistara_Logo.svg/1200px-Vistara_Logo.svg.png',
        source: 'Bangalore (BLR)',
        destination: 'Delhi (DEL)',
        departureTime: new Date(new Date().setHours(18, 0, 0, 0) + 72 * 60 * 60 * 1000),
        arrivalTime: new Date(new Date().setHours(23, 45, 0, 0) + 72 * 60 * 60 * 1000),
        duration: 345,
        price: 9800,
        availableSeats: 12,
        stops: 1,
        cabinClass: 'Premium Economy',
        amenities: ['Select Seats', 'In-flight Entertainment', 'Luxury Dining'],
        isRefundable: true,
        baggageInfo: { carryOn: '12kg', checked: '25kg' }
      }
    ];

    await Flight.insertMany(flights);

    console.log('Data successfully inserted into MongoDB!');
    process.exit();
  } catch (error) {
    console.error(`seeding error: ${(error as Error).message}`);
    process.exit(1);
  }
};

importData();
