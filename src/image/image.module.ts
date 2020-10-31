import { Module, HttpException, HttpStatus } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { ApiImage } from './image.model';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';

const imageFilter = function (req, file, cb) {
  // accept image only  
  if (!file.originalname.match(/\.(jpg|jpeg|png|svg)$/)) {
    cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
  }
  cb(null, true);
};

@Module({
  controllers: [ImageController],
  providers: [ImageService],
  imports: [
    TypegooseModule.forFeature([{
      typegooseClass: ApiImage,
      schemaOptions: { versionKey: false }
    }]),
    MulterModule.registerAsync({
      useFactory: () => ({
        fileFilter: imageFilter
      })
    })
  ]
})
export class ImageModule {}
