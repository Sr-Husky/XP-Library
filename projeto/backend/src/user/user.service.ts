import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService){}

    async login(email: string, senha: string){
        const user = await this.prisma.user.findUnique({
            where: { email: email },
        });

        if(!user) throw new NotFoundException('Usuario não encontrado');

        if(senha !== user.senha) throw new UnauthorizedException('Senha incorreta');
        
        return user;
    }

    async getUser(id: number){
        return await this.prisma.user.findUnique({
            where: {id: id},
            include: {
                xp: true,
                favoritos: true,
            },
        })
    }

}
