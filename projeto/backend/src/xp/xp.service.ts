import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'

@Injectable()
export class XpService {
  constructor(private readonly prisma: PrismaService) {}

  async listarPublicas(busca?: string, tags?: string[]) {
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
}
