import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs'
import * as bodyParser from 'body-parser';

const httpsOptions = {
  key: fs.readFileSync('./secrets/cert.key'),
  cert: fs.readFileSync('./secrets/cert.crt'),
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{httpsOptions});
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    origin: true, 
    credentials: true,
    /*origin: [
      'https://localhost:4200',   // Para el navegador
      'https://10.0.2.2:4200',   // Para el emulador de Android
      'http://localhost:8100',   // Para Ionic si usas este framework // Agrega el enlace de ngrok
       // Si deseas permitir todos los orígenes
    ],*/
  });
  
  

  await app.listen(3000, '0.0.0.0');
}
bootstrap();

