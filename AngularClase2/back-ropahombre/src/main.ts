import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    credentials: true,
    origin: [
      'http://localhost:4200',   // Para el navegador
      'http://10.0.2.2:4200',   // Para el emulador de Android
      'http://localhost:8100',   // Para Ionic si estás usando este framework
      '*',                       // Para permitir todos los orígenes (útil en desarrollo)
    ],
  });
  

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
