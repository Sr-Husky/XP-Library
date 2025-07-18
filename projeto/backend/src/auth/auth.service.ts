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
            include: {
                xp: true, 
                favoritos: true
            }
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
        userSS.logado = true;
        return userSS;
    }

    async login(user: any){
        const payload = {username: user.username, sub: user.id, role: user.role};
        const payloadRefresh = {sub: user.id};

        const refresh = this.jwtService.sign(payloadRefresh, {expiresIn: '7d'});
        await this.prisma.user.update({
            where: {id: user.id},
            data: {refresh: refresh}
        });

        return {user: user, access_token: this.jwtService.sign(payload), refresh_token: refresh};
    }

    async refresh(refresh_token: string) {
        try {

            const decoded = this.jwtService.verify(refresh_token);
            const userId = decoded.sub;

            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                }
            });

            if (!user || user.refresh !== refresh_token) {
                return null;
            }

            return this.login(user);
        } catch (err) {
            console.log("err:",err)
            return null; // token inválido, expirado, etc
        }
    }


}
