import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { XpModule } from './xp/xp.module';
import { PrismaModule } from './prisma/prisma.module';
import { InteractModule } from './interact/interact.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, XpModule, PrismaModule, InteractModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
