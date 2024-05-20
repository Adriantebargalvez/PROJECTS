import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { RopahombreService } from './ropahombre.service';
import { RopahombreDto } from './dto/ropahombre.dto';



@Controller('api/ropahombre')
export class RopahombreController {
    constructor(private readonly ropahombreService: RopahombreService){}
    
    @Get()
    async getRopahombre(){
        return this.ropahombreService.getRopahombre();
    }
    @Get('/:id')
    async getOneRopahombre(@Param('id')id:string){
        return this.ropahombreService.getOneRopahombre(id);
    }
    @Get('name/:name')
    async getRopahombreByName(@Param('name')name:string){
        return this.ropahombreService.getRopahombreByName(name);
    }
    @Post('insertar')
    async addRopahombre(@Body()ropahombreDto: RopahombreDto){
        return this.ropahombreService.addRopahombre(ropahombreDto)
    }
    @Patch('update/:id')
    async updateRopahombre(@Body()ropahombreDto: RopahombreDto,@Param('id')id:string){
        return this.ropahombreService.updateRopahombre(ropahombreDto,id)
    }
    @Delete('delete/:id')
    async deleteRopahombre(@Param('id')id:string){
        return this.ropahombreService.deleteRopahombre(id)
    }

  }

