'use strict';

const { db } = require('../../models');
const { app } = require('../../server');
const supertest = require('supertest');
const mockServer = supertest(app);

beforeAll(async () => {
  db.sync();
});
afterAll(async () => {
  db.drop({});
});

describe('test the server routes and db', () => {
  test('we can post a new user to /signup', async () => {
    const res = await mockServer
      .post('/signup')
      .send({ username: 'john', password: '1234', role: 'user' });
    expect(res.status).toBe(201);
    // expect(JSON.parse(res.text).username).toBe('john');
    // expect(JSON.parse(res.text).password).toBeTruthy();
  });

  test('we can send a user via basic auth to /signin', async () => {
    const res = await mockServer.post('/signin').auth('john', '1234');
    // .set('Authorization', encodedBasicAuthStr)

    console.log('Response status:', res.status);
    console.log('Response text:', res.text);

    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe('john');
    expect(res.body.user.password).toBeTruthy();
  });
});