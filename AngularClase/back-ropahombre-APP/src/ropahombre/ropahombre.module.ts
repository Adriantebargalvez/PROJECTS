import { Module } from '@nestjs/common';
import { RopahombreController } from './ropahombre.controller';
import { RopahombreService } from './ropahombre.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RopahombreSchema } from './schemas/ropahombre.schema';

@Module({
  imports:[
    MongooseModule.forFeature([
      {
        name: 'Ropahombre',
        schema: RopahombreSchema,
        collection:'ropahombre'
      }
    ])
  ],
  controllers: [RopahombreController],
  providers: [RopahombreService]
})
export class RopahombreModule {}
