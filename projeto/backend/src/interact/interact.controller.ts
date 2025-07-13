import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { InteractService } from './interact.service';
import { FavoritarDto } from './dto/favoritar.dto';

@Controller('interact')
export class InteractController {
    constructor(private readonly interactService: InteractService){}

    // Cria um registro na tabela de favoritos
    @Post('fav')
    favoritar(@Body() dto: FavoritarDto){
        return this.interactService.favoritar(dto);
    }

    // Deleta um registro da tabela de favoritos
    @Delete('fav/:id')
    desfavoritar(@Param('id') id: string){
        return this.interactService.desfavoritar(Number(id));
    }

    // Registra uma interação de like
    @Post('like/:user/:xp')
    like(@Param('user') user: string, @Param('xp') xp: string){
        return this.interactService.like(Number(user), Number(xp));
    }

    // Remove o registro de uma interação de like
    @Post('deslike/:user/:xp')
    deslike(@Param('user') user: string, @Param('xp') xp: string, @Body() like: number[]){
        return this.interactService.deslike(Number(user), Number(xp), like);
    }

}
