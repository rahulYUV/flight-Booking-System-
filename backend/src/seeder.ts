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
        source: 'Delhi (DEL)',
        destination: 'Mumbai (BOM)',
        departureTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // Flight tomorrow
        arrivalTime: new Date(new Date().getTime() + 26 * 60 * 60 * 1000),
        price: 5500,
        availableSeats: 180,
      },
      {
        flightNumber: '6E-205',
        airline: 'IndiGo',
        source: 'Mumbai (BOM)',
        destination: 'Bangalore (BLR)',
        departureTime: new Date(new Date().getTime() + 48 * 60 * 60 * 1000), // Flight in 2 days
        arrivalTime: new Date(new Date().getTime() + 50 * 60 * 60 * 1000),
        price: 4200,
        availableSeats: 150,
      },
      {
        flightNumber: '6E-310',
        airline: 'IndiGo',
        source: 'Bangalore (BLR)',
        destination: 'Delhi (DEL)',
        departureTime: new Date(new Date().getTime() + 72 * 60 * 60 * 1000), // Flight in 3 days
        arrivalTime: new Date(new Date().getTime() + 74 * 60 * 60 * 1000),
        price: 6800,
        availableSeats: 12, // Almost full
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
