import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RopahombreModule } from './ropahombre/ropahombre.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://adriantebar19:root@ropahombrebase.ymiayzv.mongodb.net/ropa?retryWrites=true&w=majority'),
    RopahombreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
