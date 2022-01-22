import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as mongoose from 'mongoose';
import { mockUser, mockLoginDto } from '../src/constants/mock.contants';
import { UserRoles } from '../src/auth/schemas/user.schema';

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

  it('(POST), /auth/signUp route register a new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signUp')
      .set('Accept', 'application/json')
      .send(mockUser);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(mockUser.email);
    expect(res.body.name).toBe(mockUser.name);
    expect(res.body.role).toBe(UserRoles.USER);
  });

  it('(GET), /auth/login route login', async () => {
    const res = await request(app.getHttpServer())
      .get('/auth/login')
      .send({ ...mockLoginDto });
    expect(res.status).toBe(200);
    expect(res.body.email).toBe(mockLoginDto.email);
  });
});
