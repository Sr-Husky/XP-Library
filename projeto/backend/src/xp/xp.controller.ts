import { Controller, Get, Query } from '@nestjs/common';
import { XpService } from './xp.service';

@Controller('xp')
export class XpController {
    constructor(private readonly xpService: XpService) {}

    @Get('publicas')
    listarPublicas(
        @Query('busca') busca?: string,
        @Query('tag') tag?: string,
    ) {
        const tags = tag?.split(',');
        return this.xpService.listarPublicas(busca, tags);
    }
}
