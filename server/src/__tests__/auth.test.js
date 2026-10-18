const request = require('supertest');
const app = require('../app');

describe('Authentication API', () => {
  test('registers a user and returns a token', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test.user@example.com',
      password: 'securePass123',
    });

    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('test.user@example.com');
    expect(response.body.token).toBeTruthy();
  });

  test('rejects duplicate emails', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Another User',
      email: 'test.user@example.com',
      password: 'securePass123',
    });

    expect(response.status).toBe(409);
  });

  test('requires authentication for protected endpoint', async () => {
    const response = await request(app).get('/api/demo/profile');
    expect(response.status).toBe(401);
  });
});
