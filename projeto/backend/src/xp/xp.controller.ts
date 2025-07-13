import { Controller, Get, Query, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { XpService } from './xp.service';
import { criarXpDto } from './dto/criarXp.dto';

@Controller('xp')
export class XpController {
    constructor(private readonly xpService: XpService) {}

    // Deleta uma experiência pelo id
    @Delete('remover/:id')
    removeXp(@Param('id') id: string){
        return this.xpService.removeXp(Number(id));
    }

    // Coleta todas experiências públicas, com base na busca e nas tags
    @Get('publicas')
    listarPublicas(@Query('busca') busca?: string, @Query('tag') tag?: string) {
        const tags = tag?.split(',');
        return this.xpService.listarPublicas(busca, tags);
    }

    // Coleta as experiencias de um usuário com filtros (se tiver)
    @Get('usuario/:id')
    listarXpUser(@Param('id') id: string, @Query('busca') busca?: string, @Query('tag') tag?: string) {
        const tags = tag?.split(',');
        return this.xpService.listarXpUser(Number(id), busca, tags);
    }

    // Cria uma experiência
    @Post('criar')
    criarXp(@Body() dto: criarXpDto){
        return this.xpService.criarXp(dto);
    }

    // Atualiza uma experiência
    @Put('atualizar')
    atualizaXp(@Body() dto: {id: number, texto: string, contexto: string, tags: string[], pub: boolean, likes: number}){
        return this.xpService.atualizaXp(dto);
    }

    // Retorna uma experiência especifica pelo id
    @Get(':id')
    getXp(@Param('id') id: string){
        return this.xpService.getXp(Number(id));
    }

}
