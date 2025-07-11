import { Get, Body, Controller, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Post('login')
    login(@Body() dto: {email:string, senha:string}){
        return this.userService.login(dto.email, dto.senha);
    }

    @Get(':id')
    getUser(@Param('id') id: string){
        return this.userService.getUser(Number(id));
    }

}
