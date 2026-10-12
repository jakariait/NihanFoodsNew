const mongoose = require('mongoose');
const request = require('supertest');
const { loginAdmin } = require('./helpers/loginHelper');
const CustomerFeedbackModel = require('../models/CustomerFeedbackModel');

let app;
let adminToken;
let createdId;

beforeAll(async () => {
  app = require('../app');
  await mongoose.connect(process.env.MONGO_URI);
  adminToken = await loginAdmin(app);
});

afterAll(async () => {
  await CustomerFeedbackModel.deleteMany({});
  await mongoose.disconnect();
});

const authRequest = (method, url) =>
  request(app)[method](url).set('Authorization', `Bearer ${adminToken}`);

describe('Customer Feedback API', () => {
  test('rejects unauthenticated create', async () => {
    const res = await request(app).post('/api/customer-feedback').send({
      name: 'Hacker',
      message: 'Should not work',
      rating: 5,
    });
    expect(res.status).toBe(401);
  });

  test('rejects create without required fields', async () => {
    const res = await authRequest('post', '/api/customer-feedback').send({
      name: 'John',
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  test('rejects rating outside 1-5', async () => {
    const res = await authRequest('post', '/api/customer-feedback').send({
      name: 'John',
      message: 'Great food',
      rating: 7,
    });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/between 1 and 5/i);
  });

  test('creates feedback with customer image', async () => {
    const res = await authRequest('post', '/api/customer-feedback')
      .field('name', 'Test Customer')
      .field('message', 'Delicious and fresh')
      .field('rating', '5')
      .field('location', 'Dhaka')
      .attach('customerImage', Buffer.from('fake-jpeg-data'), 'customer.jpg');

    expect(res.status).toBe(201);
    expect(res.body.data.name).toBe('Test Customer');
    expect(res.body.data.rating).toBe(5);
    expect(res.body.data.location).toBe('Dhaka');
    expect(res.body.data.image).toBeTruthy();

    createdId = res.body.data._id;
  });

  test('lists feedback with pagination', async () => {
    const res = await authRequest('get', '/api/customer-feedback').query({
      page: 1,
      limit: 10,
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('totalItems');
    expect(res.body).toHaveProperty('totalPages');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.some((item) => item._id === createdId)).toBe(true);
  });

  test('filters feedback by search term', async () => {
    const res = await authRequest('get', '/api/customer-feedback').query({
      search: 'Test Customer',
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0]._id).toBe(createdId);
  });

  test('gets feedback by id', async () => {
    const res = await authRequest('get', `/api/customer-feedback/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.data._id).toBe(createdId);
  });

  test('returns 404 for unknown id and 400 for invalid id', async () => {
    const unknown = await authRequest(
      'get',
      `/api/customer-feedback/${new mongoose.Types.ObjectId()}`
    );
    expect(unknown.status).toBe(404);

    const invalid = await authRequest('get', '/api/customer-feedback/not-an-id');
    expect(invalid.status).toBe(400);
  });

  test('updates feedback fields', async () => {
    const res = await authRequest('put', `/api/customer-feedback/${createdId}`).send({
      message: 'Updated message',
      rating: '4',
      location: 'Chattogram',
    });

    expect(res.status).toBe(200);
    expect(res.body.data.message).toBe('Updated message');
    expect(res.body.data.rating).toBe(4);
    expect(res.body.data.location).toBe('Chattogram');
  });

  test('rejects invalid rating on update', async () => {
    const res = await authRequest('put', `/api/customer-feedback/${createdId}`).send({
      rating: '12',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/between 1 and 5/i);
  });

  test('deletes feedback', async () => {
    const res = await authRequest('delete', `/api/customer-feedback/${createdId}`);
    expect(res.status).toBe(200);

    const after = await authRequest('get', `/api/customer-feedback/${createdId}`);
    expect(after.status).toBe(404);
  });

  test('public active endpoint requires no auth and returns only active feedback', async () => {
    const active = await CustomerFeedbackModel.create({
      name: 'Active Customer',
      message: 'Visible on the storefront',
      rating: 5,
      location: 'Dhaka',
      isActive: true,
    });
    const hidden = await CustomerFeedbackModel.create({
      name: 'Hidden Customer',
      message: 'Hidden from the storefront',
      rating: 2,
      isActive: false,
    });

    const res = await request(app).get('/api/activecustomer-feedback');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);

    const ids = res.body.data.map((item) => item._id);
    expect(ids).toContain(String(active._id));
    expect(ids).not.toContain(String(hidden._id));
  });
});
