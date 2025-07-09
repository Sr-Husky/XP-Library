import { Module } from '@nestjs/common';
import { XpController } from './xp.controller';
import { XpService } from './xp.service';

@Module({
  controllers: [XpController],
  providers: [XpService]
})
export class XpModule {}
