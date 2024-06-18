import { Schema } from "mongoose";

export const RopahombreSchema: Schema = new Schema({

    name: {type: String, required: true},
    price: {type: Number, required: true},
    tallasDisponibles: [{ type: String, required: true }],
    tallasDisponiblesZapato: [{ type: String, required: true }],
    favorite: { type: Boolean, required: true, default: false },
    oferta: {type: Number, required: true},
    category: {type: String, required: true},
    imagen: {type: String, required: true, maxlength: 1048576000000 },
    imagenLado: {type: String, required: true, maxlength: 104857600000  },
    imagenDetras: {type: String, required: true, maxlength: 104857600000 },
    descripcion: {type: String, required: true},
   

 
})