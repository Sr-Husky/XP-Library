import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('UserController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user/cadastro (POST) deve cadastrar novo usuário', async () => {
    const dto = {
      usuario: 'teste',
      email: 'teste.e2e@gmail.com',
      senha: '12345678',
      data: new Date(),
      logado: true,
      like: [0, 0],
    };

    // Apaga o usuário antes, se já existir
    await prisma.user.deleteMany({ where: { email: dto.email } });

    // Faz a requisição
    const response = await request(app.getHttpServer())
      .post('/user/cadastro')
      .send(dto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(dto.email);
  });
});
