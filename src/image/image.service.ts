import { Injectable } from '@nestjs/common';
import { ApiImage } from './image.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

const sharp = require ( 'sharp' );

@Injectable ()
export class ImageService {
    constructor( @InjectModel ( ApiImage ) private readonly imageModel: ReturnModelType<typeof ApiImage> ) {
    }

    async create( file, createImgDto: { name: string, image_file: Buffer, type?: string, width?: number, height?: number } = null ) {
        if ( !createImgDto.type || createImgDto.type === '' ) createImgDto.type = 'test'
        const { width, height } = createImgDto
        let newImageResized = await new this.imageModel ( {
            name: `${ createImgDto.name }`,
            type: createImgDto.type,
            image_file: {
                data: file.buffer,
                contentType: file.mimetype
            }
        } );
        file.mimetype !== 'image/svg+xml' && ( newImageResized.image_file = await sharp ( file.buffer )
            .png ()
            .resize ( { width: +width || null, height: +height || null } )
            .toBuffer ( { resolveWithObject: true } )
            .then ( ( buffer ) => ( {
                data: buffer.data,
                contentType: file.mimetype
            } ) )
            .catch ( err => console.log ( 'Resizing Error', err ) ) )
        return newImageResized.save ()
    }

    async imageEncode( file, size: { width: string; height: string } = null ) {
        return await sharp ( file.buffer )
            .resize ( +size.width, +size.height )
            .toBuffer ()
            .then ( ( buffer ) => buffer )
    }

    async findAll() {
        return await this.imageModel.find ( {}, { image_file: 0 } ).lean ().exec ();
    }

    async getAllByType( type: string ) {
        return await this.imageModel.find ( { type: type }, { image_file: 0 } ).lean ().exec ()
    }

    async getById( id ) {
        return await this.imageModel.findById ( id ).exec ();
    }

    async getByName( name ) {
        return await this.imageModel.findOne ( { name: name } ).exec ();
    }

    async removeImage( id ) {
        return this.imageModel.findByIdAndDelete ( id );
    }

    async removeImageByName( name ) {
        return this.imageModel.findOneAndDelete ( { name: name } );
    }

    async removeImageByType( type ) {
        return this.imageModel.deleteMany ( { type: type } );
    }
}
