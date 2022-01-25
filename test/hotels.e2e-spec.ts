import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as mongoose from 'mongoose';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const user = {
    name: 'test',
    email: 'email1@gmail.com',
    password: '123456789',
    role: 'SELLER',
  };
  const newHotel = {
    name: 'Hotel new',
    description: 'Hotel new description',
    email: 'fake@gmail.com',
    address: 'Calle El Alcalde No. 15, Las Condes Santiago, . CL',
    category: 'TWO_START',
    location: {},
    user: '61cd5ekcsv66945x1wc',
    _id: new mongoose.Types.ObjectId(),
  };

  afterAll(() => mongoose.disconnect());

  let jwtToken;
  let hotelCreated;

  it('(GET), /auth/login route login', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/login')
      .send({ email: user.email, password: user.password });
    jwtToken = res.body.token;
    expect(res.status).toBe(200);
  });

  it('(POST), /hotels route create a new hotel', async () => {
    return request(app.getHttpServer())
      .post('/hotels')
      .set('Authorization', 'Bearer ' + jwtToken)
      .set('Accept', 'application/json')
      .send(newHotel)
      .expect(201)
      .then((res) => {
        hotelCreated = res.body;
        expect(res.body._id).toBeDefined();
        expect(res.body.name).toEqual(newHotel.name);
      });
  });

  it('(GET), /hotels route it gets all hotels', async () => {
    return request(app.getHttpServer())
      .get('/hotels')
      .expect(200)
      .then((res) => {
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('(GET), /hotels/:id route it gets one hotel by id', async () => {
    return request(app.getHttpServer())
      .get(`/hotels/${hotelCreated._id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body._id).toEqual(hotelCreated._id);
      });
  });

  it('(PUT), /hotels/:id route it edit one hotel by id', async () => {
    return request(app.getHttpServer())
      .put(`/hotels/${hotelCreated._id}`)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({ name: 'Updated name' })
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.name).toEqual('Updated name');
      });
  });

  it('(DELETE), /hotels/:id route it removes one hotel by id', async () => {
    return request(app.getHttpServer())
      .delete(`/hotels/${hotelCreated._id}`)
      .set('Authorization', 'Bearer ' + jwtToken)
      .expect(200)
      .then((res) => {
        expect(res.body).toBeDefined();
        expect(res.body.deleted).toEqual(true);
      });
  });
});
