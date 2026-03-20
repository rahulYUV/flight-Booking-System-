import request from 'supertest';
import { app } from '../../index';
import Flight from '../../models/Flight';

describe('Flight Controller API Tests', () => {

  it('GET /api/flights/ returns an empty array initially', async () => {
    // 1. Arrange & Act: Send a fake HTTP GET request to our app
    const response = await request(app)
      .get('/api/flights/')
      .send();

    // 2. Assert: Verify the server responds with a 200 OK status
    expect(response.status).toBe(200);
    
    // 3. Assert: Verify the JSON body is blank because the memory DB is empty
    expect(response.body).toEqual([]);
  });

  it('GET /api/flights/ can fetch an existing flight from the database', async () => {
    // 1. Arrange: Manually insert a mock flight straight into the memory database
    await Flight.create({
      flightNumber: '6E-999',
      airline: 'IndiGo Mock',
      source: 'Delhi (DEL)',
      destination: 'Chennai (MAA)',
      departureTime: new Date(),
      arrivalTime: new Date(),
      price: 3500,
      availableSeats: 50,
    });

    // 2. Act: Call the search API route over Supertest
    const response = await request(app)
      .get('/api/flights/')
      .send();

    // 3. Assert: We expect exactly 1 flight, and verify its distinct details
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].flightNumber).toBe('6E-999');
    expect(response.body[0].airline).toBe('IndiGo Mock');
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
