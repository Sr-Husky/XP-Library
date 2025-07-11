import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FavoritarDto } from './dto/favoritar.dto';

@Injectable()
export class InteractService {
    constructor(private readonly prisma: PrismaService){}

    async like(userId: number, cardId: number){
        try {
            await this.prisma.$transaction(async (tx) => {
                await tx.xp.update({
                    where: {id: cardId},
                    data: {likes: { increment: 1 }}
                });

                await tx.user.update({
                    where: {id: userId},
                    data: {like: { push: cardId }}
                });

                return true;
            });
        } catch(err) {
            return false;
        }
    }

    async deslike(userId: number, cardId: number, like: number[]){
        try {
            await this.prisma.$transaction(async (tx) => {
                await tx.xp.update({
                    where: {id: cardId},
                    data: {likes: { decrement: 1 }}
                });

                await tx.user.update({
                    where: {id: userId},
                    data: {like: like}
                });

                return true;
            });
        } catch(err) {
            return false;
        }
    }

    async favoritar(dto: FavoritarDto){
        dto.dataFav = new Date();
        return await this.prisma.fav.create({data: dto});
    }

    async desfavoritar(id: number){
        return await this.prisma.fav.delete({where: {id: id}})
    }

}
