import { Get, Body, Controller, Param, Post, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CriarUserDto } from './dto/criarUser.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    // Recebe um objeto com as informações do usuário e faz o cadastro
    @Post('cadastro')
    async cadUser(@Body() dto: CriarUserDto){
        return await this.userService.cadUser(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER')
    @Post('logout')
    async logout(@Request() req){
        return await this.userService.logout(req.user.id);
    }

    // Recebe o token de um usuário e retorna um objeto do usuário
    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Request() req) {
        return await this.userService.getUser(req.user.id);
    }

    // Retorna todos os usuários
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Get()
    async getAllUsers(@Request() req){
        return await this.userService.getAllUsers();
    }

}
