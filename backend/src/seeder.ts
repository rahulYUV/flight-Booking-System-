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

    const flights: any[] = [];
    const cities = [
      { name: 'Delhi', code: 'DEL' },
      { name: 'Mumbai', code: 'BOM' },
      { name: 'Bangalore', code: 'BLR' },
      { name: 'Hyderabad', code: 'HYD' },
      { name: 'Chennai', code: 'MAA' },
      { name: 'Kolkata', code: 'CCU' },
      { name: 'Ahmedabad', code: 'AMD' },
      { name: 'Pune', code: 'PNQ' },
      { name: 'Kochi', code: 'COK' },
      { name: 'Goa', code: 'GOI' },
      { name: 'Patna', code: 'PAT' },
      { name: 'Lucknow', code: 'LKO' },
      { name: 'Jaipur', code: 'JAI' },
      { name: 'Bhubaneswar', code: 'BBI' },
      { name: 'Guwahati', code: 'GAU' },
      { name: 'Chandigarh', code: 'IXC' },
      { name: 'Indore', code: 'IDR' },
      { name: 'Nagpur', code: 'NAG' },
      { name: 'Srinagar', code: 'SXR' },
      { name: 'Amritsar', code: 'ATQ' },
      { name: 'Varanasi', code: 'VNS' },
      { name: 'Ranchi', code: 'IXR' },
      { name: 'Raipur', code: 'RPR' },
      { name: 'Surat', code: 'STV' },
      { name: 'Vishakhapatnam', code: 'VTZ' }
    ];

    const airlines = [
      { name: 'IndiGo', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/IndiGo_Airlines_logo.svg/1200px-IndiGo_Airlines_logo.svg.png' },
      { name: 'Air India', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Air_India_Logo_2023.svg/1200px-Air_India_Logo_2023.svg.png' },
      { name: 'Vistara', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d5/Vistara_Logo.svg/1200px-Vistara_Logo.svg.png' }
    ];

    // Generate flights for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      cities.forEach((source, sIdx) => {
        cities.forEach((dest, dIdx) => {
          if (sIdx !== dIdx) {
            // Add Economy Flight
            flights.push({
              flightNumber: `6E-${1000 + flights.length}`,
              airline: airlines[0].name,
              airlineLogo: airlines[0].logo,
              source: `${source.name} (${source.code})`,
              destination: `${dest.name} (${dest.code})`,
              departureTime: new Date(new Date(date).setHours(8 + (sIdx % 5), 0, 0, 0)),
              arrivalTime: new Date(new Date(date).setHours(10 + (sIdx % 5), 30, 0, 0)),
              duration: 150,
              price: 3500 + Math.random() * 2000,
              availableSeats: 180,
              stops: 0,
              cabinClass: 'Economy',
              amenities: ['Veg Meal', 'Standard Legroom'],
              isRefundable: false,
              baggageInfo: { carryOn: '7kg', checked: '15kg' }
            });

            // Add Business Flight
            flights.push({
              flightNumber: `AI-${2000 + flights.length}`,
              airline: airlines[1].name,
              airlineLogo: airlines[1].logo,
              source: `${source.name} (${source.code})`,
              destination: `${dest.name} (${dest.code})`,
              departureTime: new Date(new Date(date).setHours(16 + (sIdx % 3), 30, 0, 0)),
              arrivalTime: new Date(new Date(date).setHours(19 + (sIdx % 3), 0, 0, 0)),
              duration: 150,
              price: 12000 + Math.random() * 5000,
              availableSeats: 20,
              stops: 0,
              cabinClass: 'Business',
              amenities: ['Premium Dining', 'Priority Boarding', 'Extra Legroom'],
              isRefundable: true,
              baggageInfo: { carryOn: '10kg', checked: '35kg' }
            });
          }
        });
      });
    }

    await Flight.insertMany(flights);

    console.log('Data successfully inserted into MongoDB!');
    process.exit();
  } catch (error) {
    console.error(`seeding error: ${(error as Error).message}`);
    process.exit(1);
  }
};

importData();
