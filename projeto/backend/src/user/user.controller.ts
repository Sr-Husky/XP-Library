import { Get, Body, Controller, Param, Post, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CriarUserDto } from './dto/criarUser.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    // Recebe um objeto com as informações do usuário e faz o cadastro
    @Post('cadastro')
    async cadUser(@Body() dto: CriarUserDto){
        return await this.userService.cadUser(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Request() req){
        return await this.userService.logout(req.user.id);
    }

    // Recebe o token de um usuário e retorna um objeto do usuário
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Request() req) {
        return this.userService.getUser(req.user.id);
    }

    // Retorna todos os usuários
    @UseGuards(JwtAuthGuard)
    @Get()
    getAllUsers(@Request() req){
        //Aqui eu verifico o role
        return this.userService.getAllUsers();
    }

}
