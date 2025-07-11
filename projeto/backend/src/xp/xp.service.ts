import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'
import { criarXpDto } from './dto/criarXp.dto';

@Injectable()
export class XpService {
  constructor(private readonly prisma: PrismaService){}

  async getXp(id: number){
    return this.prisma.xp.findUnique({
      where: {id: id},
      include: {user: true}
    })
  }

  async listarPublicas(busca?: string, tags?: string[]){
    return this.prisma.xp.findMany({
      where: {
        pub: true,
        AND: [
            busca ? {
                OR: [
                    { texto: { contains: busca, mode: 'insensitive' } },
                    { contexto: { contains: busca, mode: 'insensitive' } },
                ],
            } : {},
            tags && tags.length > 0 ? {
                tags: { hasSome: tags }
            } : {},
        ],
      },
      orderBy: { mod: 'desc' },
    });
  }

  async userXp(id: number){
    return this.prisma.xp.findMany({
      where: {
        id_user: id
      }
    })
  }

  async criarXp(dto: criarXpDto){
    dto.data = new Date(dto.data);
    dto.mod = new Date(dto.mod);
    return this.prisma.xp.create({data: dto});
  }

  async atualizaXp(dto: {id: number, texto: string, contexto: string, tags: string[], pub: boolean, likes: number}){
    return this.prisma.xp.update({
      where: {id: dto.id},
      data: {
        texto: dto.texto,
        contexto: dto.contexto,
        tags: dto.tags,
        mod: new Date(),
        pub: dto.pub,
        likes: dto.likes
      }
    })
  }

  async removeXp(id: number){
    return this.prisma.xp.delete({where: {id: id}});
  }
}
