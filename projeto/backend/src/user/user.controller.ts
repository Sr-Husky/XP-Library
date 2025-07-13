import { Get, Body, Controller, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CriarUserDto } from './dto/criarUser.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    // Recebe um objeto com as informações do usuário e faz o cadastro
    @Post('cadastro')
    async cadUser(@Body() dto: CriarUserDto){
        return await this.userService.cadUser(dto);
    }

    // Recebe o login e senha para validar o login
    @Post('login')
    async login(@Body() dto: {email:string, senha:string}){
        return await this.userService.login(dto.email, dto.senha);
    }

    @Post('logout/:id')
    async logout(@Param('id') id: string){
        return await this.userService.logout(Number(id));
    }

    // Recebe o "id" de um usuário e retorna um objeto do usuário
    @Get(':id')
    getUser(@Param('id') id: string){
        return this.userService.getUser(Number(id));
    }

    // Retorna todos os usuários    
    @Get()
    getAllUsers(){
        return this.userService.getAllUsers();
    }

}
