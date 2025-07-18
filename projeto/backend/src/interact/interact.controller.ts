import { Body, Controller, Delete, Param, Post, UseGuards, Request } from '@nestjs/common';
import { InteractService } from './interact.service';
import { FavoritarDto } from './dto/favoritar.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('interact')
export class InteractController {
    constructor(private readonly interactService: InteractService){}

    // Cria um registro na tabela de favoritos
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER')
    @Post('fav')
    favoritar(@Body() dto: FavoritarDto, @Request() req){
        if(dto.id_user !== req.user.id) return null;
        return this.interactService.favoritar(dto);
    }

    // Deleta um registro da tabela de favoritos
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER', 'ADMIN')
    @Post('desfav')
    async desfavoritar(@Body() dto: any, @Request() req){

        if(dto.id_user === req.user.id){
            return this.interactService.desfavoritar(Number(dto.id));
        } else {
            return null;
        }
    }

    // Registra uma interação de like
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER')
    @Post('like/:xp')
    like(@Param('xp') xp: string, @Request() req){
        return this.interactService.like(req.user.id, Number(xp));
    }

    // Remove o registro de uma interação de like
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('USER', 'ADMIN')
    @Post('deslike/:xp')
    deslike(@Param('xp') xp: string, @Body() like: number[], @Request() req){
        return this.interactService.deslike(req.user.id, Number(xp), like);
    }

}
