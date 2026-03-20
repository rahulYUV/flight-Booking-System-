import request from 'supertest';
import { app } from '../../index';

describe('User Controller API Tests', () => {
  const testUser = {
    name: 'Test Passenger',
    email: 'testpassenger@example.com',
    password: 'password123'
  };

  it('POST /api/users/signup registers a new user successfully', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(testUser.name);
    expect(response.body.email).toBe(testUser.email);
    expect(response.body).toHaveProperty('token');
  });

  it('POST /api/users/signup fails if email is already in use', async () => {
    // First, register the user
    await request(app).post('/api/users/signup').send(testUser);

    // Then, try to register them again
    const response = await request(app)
      .post('/api/users/signup')
      .send(testUser);

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('User already exists');
  });

  it('POST /api/users/login authenticates a user and returns a token', async () => {
    // Register the user first
    await request(app).post('/api/users/signup').send(testUser);

    // Attempt login
    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('POST /api/users/login rejects invalid credentials', async () => {
    await request(app).post('/api/users/signup').send(testUser);

    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid email or password');
  });

  it('GET /api/users/profile securely fetches a profile with a valid token', async () => {
    const signupResponse = await request(app).post('/api/users/signup').send(testUser);
    const token = signupResponse.body.token;

    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(testUser.email);
  });
});
