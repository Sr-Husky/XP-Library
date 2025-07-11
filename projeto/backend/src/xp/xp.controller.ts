import { Controller, Get, Query, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { XpService } from './xp.service';
import { criarXpDto } from './dto/criarXp.dto';

@Controller('xp')
export class XpController {
    constructor(private readonly xpService: XpService) {}

    @Get('usuario/:id')
    userXp(@Param('id') id: string){
        return this.xpService.userXp(Number(id));
    }

    @Delete('remover/:id')
    removeXp(@Param('id') id: string){
        return this.xpService.removeXp(Number(id));
    }

    @Get('publicas')
    listarPublicas(@Query('busca') busca?: string, @Query('tag') tag?: string) {
        const tags = tag?.split(',');
        return this.xpService.listarPublicas(busca, tags);
    }

    @Post('criar')
    criarXp(@Body() dto: criarXpDto){
        return this.xpService.criarXp(dto);
    }

    @Put('atualizar')
    atualizaXp(@Body() dto: {id: number, texto: string, contexto: string, tags: string[], pub: boolean, likes: number}){
        return this.xpService.atualizaXp(dto);
    }

    @Get(':id')
    getXp(@Param('id') id: string){
        return this.xpService.getXp(Number(id));
    }

}
