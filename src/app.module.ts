import { Module } from '@nestjs/common';
import { ImageModule } from './image/image.module';
import { TypegooseModule } from "nestjs-typegoose";

@Module({
  imports: [ImageModule,
    TypegooseModule.forRoot('mongodb://db_userout:Qwer123!@ds253353.mlab.com:53353/db_images', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
