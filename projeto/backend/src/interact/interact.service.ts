import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FavoritarDto } from './dto/favoritar.dto';

@Injectable()
export class InteractService {
    constructor(private readonly prisma: PrismaService){}

    // Registra um like no banco de dados
    async like(userId: number, cardId: number){
        try {
            await this.prisma.$transaction(async (tx) => {
                // Incrementa 1 no campo de like
                await tx.xp.update({
                    where: {id: cardId},
                    data: {likes: { increment: 1 }}
                });

                // Adiciona o id da experiencia no vetor de like do usuário
                await tx.user.update({
                    where: {id: userId},
                    data: {like: { push: cardId }}
                });

                return true; // Retorna true se o like for registrado
            });
        } catch(err) {
            return false; // Retorna false se o like não for registrado
        }
    }
    
    // Revoga um like no banco de dados
    async deslike(userId: number, cardId: number, like: number[]){
        try {
            await this.prisma.$transaction(async (tx) => {
                // Decrementa 1 no campo de like
                await tx.xp.update({
                    where: {id: cardId},
                    data: {likes: { decrement: 1 }}
                });

                // Remove o id da experiencia no vetor de like do usuário
                await tx.user.update({
                    where: {id: userId},
                    data: {like: like}
                });

                return true; // Retorna true se o like for revogado com sucesso
            });
        } catch(err) {
            return false; // Retorna false se o like não for revogado
        }
    }

    // Adiciona um novo registro na tabela de favorito
    async favoritar(dto: FavoritarDto){
        dto.dataFav = new Date();
        return await this.prisma.fav.create({data: dto});
    }

    // Remove um registro de favorito
    async desfavoritar(id: number){
        return await this.prisma.fav.delete({where: {id: id}})
    }

}
