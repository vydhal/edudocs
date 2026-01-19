const request = require('supertest');
const app = require('../../index');

describe('Documents API', () => {
  it('GET /api/documents should return 200 and an array', async () => {
    const res = await request(app).get('/api/documents?status=published');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('GET /api/classifications/sectors should return 200', async () => {
    const res = await request(app).get('/api/classifications/sectors');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });
});
