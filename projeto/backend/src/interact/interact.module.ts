import { Module } from '@nestjs/common';
import { InteractController } from './interact.controller';
import { InteractService } from './interact.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [InteractController],
  providers: [InteractService],
  imports: [UserModule],
})
export class InteractModule {}
