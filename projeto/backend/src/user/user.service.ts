import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CriarUserDto } from './dto/criarUser.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService){}

    // Valida o login do usuário retornar erros ou objeto do user
    async login(email: string, senha: string){
        // Coleta o usuário pelo email
        const user = await this.prisma.user.findUnique({
            where: { email: email },
        });

        // Se email não estiver registrado
        if(!user) throw new NotFoundException('Usuario não encontrado');

        // Se o usuário estiver registrado mas a senha estiver incorreta
        if(senha !== user.senha) throw new UnauthorizedException('Senha incorreta');

        await this.prisma.user.update({
            where: {email: email},
            data: {logado: true}
        })
        
        return user; // retorno bem sucedido
    }

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

        // Registra o usuário
        return await this.prisma.user.create({data: dto});
    }

}
