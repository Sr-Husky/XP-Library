import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { InteractService } from './interact.service';
import { FavoritarDto } from './dto/favoritar.dto';

@Controller('interact')
export class InteractController {
    constructor(private readonly interactService: InteractService){}

    @Post('fav')
    favoritar(@Body() dto: FavoritarDto){
        return this.interactService.favoritar(dto);
    }

    @Delete('fav/:id')
    desfavoritar(@Param('id') id: string){
        return this.interactService.desfavoritar(Number(id));
    }

    @Post('like/:user/:xp')
    like(@Param('user') user: string, @Param('xp') xp: string){
        return this.interactService.like(Number(user), Number(xp));
    }

    @Post('deslike/:user/:xp')
    deslike(@Param('user') user: string, @Param('xp') xp: string, @Body() like: number[]){
        return this.interactService.deslike(Number(user), Number(xp), like);
    }

}
