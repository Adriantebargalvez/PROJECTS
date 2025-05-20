import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { RopahombreDto } from './dto/ropahombre.dto';

@Injectable()
export class RopahombreService {
    constructor(@InjectModel('Ropahombre') private RopahombreModel: Model<RopahombreDto>){}


    async getRopahombre() {
        return await this.RopahombreModel.find();
    }
    async getOneRopahombre(id: string) {
        return await this.RopahombreModel.findById(id);
    }
    async getRopahombreByName(name: string) {
        return await this.RopahombreModel.findOne({ name: name });
    }
    
async addRopahombre(ropahombreDto: RopahombreDto) {
    const miRopa = new this.RopahombreModel(ropahombreDto);
    return await miRopa.save();
}
async updateRopahombre(ropahombreDto: RopahombreDto, id:string) {
    return await this.RopahombreModel.findByIdAndUpdate(
        id,
        {$set: ropahombreDto},
        {new: true},
    );
}
async deleteRopahombre(id:string) {
    try{
        await this.RopahombreModel.findByIdAndDelete(id)
        return{
            status:'Esta Prenda se a retirado del almacen'
        }
    }catch (e){
            return{
                status: e.message
            }
        
        }

    }
 
    }
    
    