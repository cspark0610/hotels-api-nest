import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as mongoose from 'mongoose';
import { newHotel, mockLoginDto } from '../src/constants/mock.contants';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(() => mongoose.disconnect());

  let jwtToken;
  let hotelCreated;

  it('(GET), /auth/login route login', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/login')
      .send({ ...mockLoginDto });
    jwtToken = res.body.token;
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(mockLoginDto.email);
  });

  it('(POST), /hotels route create a new hotel', async () => {
    console.log('jwtToken', jwtToken);
    const res = await request(app.getHttpServer())
      .post('/hotels')
      .set('Authorization', 'Bearer ' + jwtToken)
      .send(newHotel);

    hotelCreated = res.body;

    expect(res.status).toBe(201);
    expect(res.body._id).toBeDefined();
    expect(res.body.name).toEqual(newHotel.name);
  });

  it('(GET), /hotels route it gets all hotels', async () => {
    const res = await request(app.getHttpServer()).get('/hotels');

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('(GET), /hotels/:id route it gets one hotel by id', async () => {
    const res = await request(app.getHttpServer()).get(
      `/hotels/${hotelCreated._id}`,
    );

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body._id).toEqual(hotelCreated._id);
  });

  it('(PUT), /hotels/:id route it edit one hotel by id', async () => {
    const res = await request(app.getHttpServer())
      .put(`/hotels/${hotelCreated._id}`)
      .set('Authorization', 'Bearer ' + jwtToken)
      .send({ name: 'updated name' });

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.name).toEqual('updated name');
  });

  it('(DELETE), /hotels/:id route it removes one hotel by id', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/hotels/${hotelCreated._id}`)
      .set('Authorization', 'Bearer ' + jwtToken);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
    expect(res.body.deleted).toEqual(true);
  });
});
