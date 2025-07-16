import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly prisma: PrismaService) {}

    async validateUser(email: string, senha: string){
        
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new NotFoundException('Usuário não encontrado');
        }

        const match = await bcrypt.compare(senha, user.senha);

        if (!match) {
            throw new UnauthorizedException('Senha incorreta');
        }

        await this.prisma.user.update({
            where: { email },
            data: { logado: true },
        });

        const { senha: _, ...userSS } = user;
        return userSS;
    }

    async login(user: any){
        const payload = {username: user.username, sub: user.id};
        return {access_token: this.jwtService.sign(payload)};
    }

}
