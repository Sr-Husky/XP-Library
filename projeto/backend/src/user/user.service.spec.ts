import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let prisma: any;

  // Função que será executada antes de cada teste
  beforeEach(async () => {
    // Definição das funções que vou usar, simulando o prisma
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      } as any
    };

    // Configuração do modulo de teste
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  // Teste para ver se detecta emails já existentes
  it('deve lançar ConflictException se o e-mail já existir', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 1 });

    await expect(
      service.cadUser({usuario: "fds", email: "fds@gmail.com", senha: "fds", data: new Date(), logado: true, like: [0,0]})
    ).rejects.toThrow(ConflictException);
  });

  // Teste para ver se o usuário é criado como esperado
  it('deve criar o usuário se o e-mail não existir', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1 });

    const hashSpy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashFalso');

    const result = await service.cadUser({
      usuario: "fds", 
      email: "fds@gmail.com", 
      senha: "fds", 
      data: new Date(), 
      logado: true, 
      like: [0,0]
    });

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        usuario: "fds",
        email: "fds@gmail.com",
        senha: "hashFalso",
        data: expect.any(Date),
        logado: true,
        like: [0,0]
      }
    });

    expect(hashSpy).toHaveBeenCalledWith('fds', 10);
  });

  // Teste para ver se o usuário é retornado como esperado
  it('deve retornar o usuário pelo id', async () => {
  const id = 8;
  const mockUser = { id, usuario: 'fds' };

  (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

  const result = await service.getUser(id);

  expect(prisma.user.findUnique).toHaveBeenCalledWith({
    where: { id },
    include: { xp: true, favoritos: true },
  });

  expect(result).toEqual(mockUser);
});


});
