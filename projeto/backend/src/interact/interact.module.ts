import { Module } from '@nestjs/common';
import { InteractController } from './interact.controller';
import { InteractService } from './interact.service';

@Module({
  controllers: [InteractController],
  providers: [InteractService]
})
export class InteractModule {}
