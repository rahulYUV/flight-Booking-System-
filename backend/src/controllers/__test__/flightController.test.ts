import request from 'supertest';
import { app } from '../../index';
import Flight from '../../models/Flight';

describe('Flight Controller API Tests', () => {

  it('GET /api/flights/ returns an empty array initially with pagination', async () => {
    const response = await request(app)
      .get('/api/flights/')
      .send();

    expect(response.status).toBe(200);
    expect(response.body.flights).toEqual([]);
    expect(response.body.total).toBe(0);
    expect(response.body.page).toBe(1);
  });

  it('GET /api/flights/ can fetch an existing flight from the database', async () => {
    await Flight.create({
      flightNumber: '6E-999',
      airline: 'IndiGo Mock',
      airlineLogo: 'https://example.com/logo.png',
      source: 'Delhi (DEL)',
      destination: 'Chennai (MAA)',
      departureTime: new Date(),
      arrivalTime: new Date(),
      duration: 180,
      price: 3500,
      availableSeats: 50,
      cabinClass: 'Economy'
    });

    const response = await request(app)
      .get('/api/flights/')
      .send();

    expect(response.status).toBe(200);
    expect(response.body.flights.length).toBe(1);
    expect(response.body.flights[0].flightNumber).toBe('6E-999');
    expect(response.body.flights[0].airline).toBe('IndiGo Mock');
  });

  it('POST /api/flights/ returns 401 Unauthorized for unauthenticated users', async () => {
    // 1. Act: Try to create a flight via API without sending a logged-in Token
    const response = await request(app)
      .post('/api/flights/')
      .send({
         flightNumber: '6E-100', // Mock data
         airline: 'IndiGo'
      });

    // 2. Assert: Our AuthMiddleware should successfully block this attempt
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Not authorized, no token');
  });

});
