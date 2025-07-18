import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('login')
    async login(@Body() body: { email: string, senha: string } ){
        const res = await this.authService.validateUser(body.email, body.senha);
        return this.authService.login(res);
    }

    @Post('refresh')
    async refresh(@Body() body: {refreshToken: string}){
        return this.authService.refresh(body.refreshToken);
    }
}
