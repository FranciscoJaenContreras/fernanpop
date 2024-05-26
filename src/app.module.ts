import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ProductModule,
     MongooseModule.forRoot(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_CLUSTER}.bggsmxe.mongodb.net/${process.env.MONGODB_DATABASE}?retryWrites=true&w=majority`),
     UserModule,
    ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
