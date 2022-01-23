import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as mongoose from 'mongoose';

const user = {
  name: 'test',
  email: 'email1@gmail.com',
  password: '123456789',
};
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });
  const uri_test = process.env.MONGODB_URI_TEST;
  beforeAll(() => {
    //console.log(`${uri_test} connected`);
    mongoose.connect(uri_test, function () {
      return mongoose.connection.db.dropDatabase();
    });
  });

  afterAll(() => mongoose.disconnect());

  it('(POST) - register a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201)
      .then((res) => {
        expect(res.body.token).toBeDefined();
      });
  });

  it('(GET) - login user', () => {
    return request(app.getHttpServer())
      .get('/auth/login')
      .send({ email: user.email, password: user.password })
      .expect(200)
      .then((res) => {
        expect(res.body.token).toBeDefined();
      });
  });
});
