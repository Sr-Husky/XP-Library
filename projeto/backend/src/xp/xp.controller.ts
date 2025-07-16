import { Controller, Get, Query, Param, Post, Body, Put, Delete, UseGuards, Request } from '@nestjs/common';
import { XpService } from './xp.service';
import { criarXpDto } from './dto/criarXp.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from 'src/auth/optional-jwt-auth.guard';

@Controller('xp')
export class XpController {
    constructor(private readonly xpService: XpService) {}

    // Deleta uma experiência pelo id
    @UseGuards(JwtAuthGuard)
    @Delete('remover/:id')
    async removeXp(@Param('id') id: string, @Request() req){
        const xp = await this.xpService.getXp(Number(id), req.user.id);
        if (!xp || xp.id_user !== req.user.id) return null;
        return this.xpService.removeXp(Number(id));
    }

    // Coleta todas experiências públicas, com base na busca e nas tags
    @Get('publicas')
    listarPublicas(@Query('busca') busca?: string, @Query('tag') tag?: string) {
        const tags = tag?.split(',');
        return this.xpService.listarPublicas(busca, tags);
    }

    // Coleta as experiencias de um usuário com filtros (se tiver)
    @UseGuards(JwtAuthGuard)
    @Get('usuario')
    listarXpUser(@Request() req, @Query('busca') busca?: string, @Query('tag') tag?: string) {
        const tags = tag?.split(',');
        return this.xpService.listarXpUser(req.user.id, busca, tags);
    }

    // Cria uma experiência
    @UseGuards(JwtAuthGuard)
    @Post('criar')
    criarXp(@Body() dto: criarXpDto, @Request() req){
        dto.id_user = req.user.id;
        return this.xpService.criarXp(dto);
    }

    // Atualiza uma experiência
    @UseGuards(JwtAuthGuard)
    @Put('atualizar')
    async atualizaXp(@Body() dto: {id: number, texto: string, contexto: string, tags: string[], pub: boolean, likes: number}, @Request() req){
        const xp = await this.xpService.getXp(dto.id, req.user.id);
        if (!xp || xp.id_user !== req.user.id) return null;
        return this.xpService.atualizaXp(dto);
    }

    // Retorna uma experiência especifica pelo id
    @UseGuards(OptionalJwtAuthGuard)
    @Get(':id')
    getXp(@Param('id') id: string, @Request() req) {
        const userId = req.user?.id; // estará preenchido se token for válido
        return this.xpService.getXp(+id, userId);
    }


}
