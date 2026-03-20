import request from 'supertest';
import { app } from '../../index';
import Flight from '../../models/Flight';

describe('Booking Controller API Tests', () => {
  let userToken: string;
  let flightId: string;

  beforeEach(async () => {
    const signupResponse = await request(app)
      .post('/api/users/signup')
      .send({
        name: 'Booking User',
        email: 'booker@example.com',
        password: 'password123'
      });
    
    userToken = signupResponse.body.token;

    const flight = await Flight.create({
      flightNumber: '6E-456',
      airline: 'IndiGo Mock',
      source: 'Delhi (DEL)',
      destination: 'Pune (PNQ)',
      departureTime: new Date(),
      arrivalTime: new Date(),
      price: 4500,
      availableSeats: 2, // Low available seats to trigger exact calculations
    });

    flightId = flight._id.toString();
  });

  it('POST /api/bookings successfully creates a booking and reduces flight seats', async () => {
    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        flightId,
        passengerName: 'Booking User',
        seatNumber: '12A'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.passengerName).toBe('Booking User');
    expect(response.body.flightId).toBe(flightId);

    // Verify seats went from 2 to 1 inside MongoDB
    const updatedFlight = await Flight.findById(flightId);
    expect(updatedFlight?.availableSeats).toBe(1);
  });

  it('POST /api/bookings rejects a booking if the flight does not exist', async () => {
    const fakeId = new Flight()._id; 

    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        flightId: fakeId,
        passengerName: 'Booking User',
        seatNumber: '12B'
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Flight not found');
  });

  it('POST /api/bookings rejects a booking if there are 0 seats available', async () => {
    const flight = await Flight.findById(flightId);
    flight!.availableSeats = 0;
    await flight!.save();

    const response = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        flightId,
        passengerName: 'Late Passenger',
        seatNumber: '99Z'
      });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('No seats available for this flight');
  });

  it('GET /api/bookings fetches user-specific bookings containing flight population', async () => {
    await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ flightId, passengerName: 'Booking User', seatNumber: '14A' });

    const response = await request(app)
      .get('/api/bookings')
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    // Verifies Mongoose .populate('flightId') executes returning real flight data payload
    expect(response.body[0].flightId).toHaveProperty('airline', 'IndiGo Mock');
  });
});
