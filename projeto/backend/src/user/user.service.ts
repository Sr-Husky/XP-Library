import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CriarUserDto } from './dto/criarUser.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService){}

    // Deloga o usuário
    async logout(id: number){
        return await this.prisma.user.update({
            where: {id: id}, 
            data: {logado: false}
        })
    }

    // Coleta um usuário pelo id
    async getUser(id: number){
        return await this.prisma.user.findUnique({
            where: {id: id},
            include: {
                xp: true, // Inclui todas experiencias do usuário
                favoritos: true, // Inclui todos favoritos do usuário
            },
        })
    }

    // Coleta todos os usuários
    async getAllUsers(){
        return await this.prisma.user.findMany();
    }

    // Cadastra um usuário
    async cadUser(dto: CriarUserDto){

        // Busca o email no banco de dados
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        // Se email já estiver registrado
        if(user) throw new ConflictException('Usuário já existe');

        const hashedSenha = await bcrypt.hash(dto.senha, 10);

        const novoUsuario = await this.prisma.user.create({
            data: {
                ...dto,
                senha: hashedSenha,
            },
        });

    }

}
