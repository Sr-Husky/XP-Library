import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'
import { criarXpDto } from './dto/criarXp.dto';

@Injectable()
export class XpService {
  constructor(private readonly prisma: PrismaService){}

  // Busca o id de uma experiência e retorna um objeto dela
  async getXp(id: number, userId?: number) {
    const xp = await this.prisma.xp.findUnique({
      where: { id },
      include: { user: true },
    });

    if(!xp) return null;

    if(!xp.pub) {
      if(!userId || xp.id_user !== userId) {
        // Não logado ou não é o dono
        throw new ForbiddenException();
      }
    }

    return xp;
  }


  // Lista todas as experiências filtradas por busca ou tags (se tiver)
  async listarPublicas(busca?: string, tags?: string[]){
    return this.prisma.xp.findMany({
      where: {
        pub: true,
        AND: [
            // Verifica correspondencia no texto ou no contexto
            busca ? {
                OR: [
                    { texto: { contains: busca, mode: 'insensitive' } },
                    { contexto: { contains: busca, mode: 'insensitive' } },
                ],
            } : {}, // Se não tem busca, desconsidera o filtro
            // Verifica se todas tags especificadas estão inclusas
            tags && tags.length > 0 ? {
                tags: { hasSome: tags }
            } : {}, // Se não tem tags, desconsidera o filtro
        ],
      },
      orderBy: { mod: 'desc' }, // Ordem decrescente
      include: {user: true}
    });
  }

  // Lista todas as experiências de um usuário filtradas por busca ou tags (se tiver)
  async listarXpUser(id: number, busca?: string, tags?: string[]){
      return this.prisma.xp.findMany({
        where: {
            id_user: id,
            AND: [
                // Verifica correspondencia no texto ou no contexto
                busca ? {
                    OR: [
                        { texto: { contains: busca, mode: 'insensitive' } },
                        { contexto: { contains: busca, mode: 'insensitive' } },
                    ],
                } : {}, // Se não tem busca, desconsidera o filtro
                // Verifica se todas tags especificadas estão inclusas
                tags && tags.length > 0 ? {
                    tags: { hasSome: tags }
                } : {}, // Se não tem tags, desconsidera o filtro
            ],
        },
        orderBy: { mod: 'desc' }, // Ordem decrescente
        include: {user: true}
      });
  }

  // Cria uma experiência
  async criarXp(dto: criarXpDto){
    dto.data = new Date(dto.data); // Data atual
    dto.mod = new Date(dto.mod); // Data atual
    return this.prisma.xp.create({data: dto});
  }

  // Atualiza uma experiência pelo id
  async atualizaXp(dto: {id: number, texto: string, contexto: string, tags: string[], pub: boolean, likes: number}){
    return this.prisma.xp.update({
      where: {id: dto.id},
      data: {
        texto: dto.texto,
        contexto: dto.contexto,
        tags: dto.tags,
        mod: new Date(), // Data atual
        pub: dto.pub,
        likes: dto.likes
      }
    })
  }

  // Remove uma experiência pelo id
  async removeXp(id: number){
    return this.prisma.xp.delete({where: {id: id}});
  }
}
