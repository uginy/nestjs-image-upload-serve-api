import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Res,
    Req,
    Body,
    Delete,
    Param,
    NotFoundException,
    HttpStatus,
    Get, Query
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller ( 'image' )
export class ImageController {
    constructor( private imageService: ImageService ) {
    }

    @Post ( '' )
    @UseInterceptors ( FileInterceptor ( 'file' ) )
    async uploadImage( @UploadedFile () file, @Res () res, @Req () req, @Body () body ) {
        const findImageName = await this.imageService.getByName ( body.name )
        if ( !findImageName ) {
            const host = req.get ( 'host' );
            const image = await this.imageService.create ( file, body );
            const newImage = image.toObject ();
            newImage.image_file = undefined;
            newImage.url = `http://${ host }/image/${ newImage._id }`;
            return res.send ( newImage );
        }
        return res.status ( HttpStatus.CONFLICT ).json ( { msg: 'Image with that name has already exists!' } );
    }

    @Post ( '/encoded/:width/:height' )
    @UseInterceptors ( FileInterceptor ( 'file' ) )
    async uploadImageAndConvert( @UploadedFile () file, @Res () res, @Param () size: { width: string, height: string } ) {
        const image = await this.imageService.imageEncode ( file, size );
        return res.send ( image.toString ( 'base64' ) );
    }

    @Delete ( ':id' )
    async deleteImage( @Res () res, @Body () body, @Param ( 'id' ) id ) {
        const image = await this.imageService.removeImage ( id );

        if ( !image ) throw new NotFoundException ( 'Image does not exist!' );
        return res.status ( HttpStatus.OK ).json ( { msg: 'Image removed.' } );
    }

    @Delete ( '/type/:type' )
    async deleteImageByType( @Res () res, @Body () body, @Param ( 'type' ) type: string ) {
        const image = await this.imageService.removeImageByType ( type );

        if ( !image ) throw new NotFoundException ( 'Image does not exist!' );
        return res.status ( HttpStatus.OK ).json ( { msg: 'Images removed.' } );
    }


    @Delete ( '/name/:name' )
    async deleteImageByName( @Res () res, @Body () body, @Param ( 'name' ) name ) {
        const image = await this.imageService.removeImageByName ( name );

        if ( !image ) throw new NotFoundException ( 'Image does not exist!' );
        return res.status ( HttpStatus.OK ).json ( { msg: 'Image removed.' } );
    }

    @Get ( [ '/type/:type', '/type/' ] )
    async getImagesByType( @Req () req, @Res () res, @Param ( 'type' ) type: string ) {
        const host = req.get ( 'host' );
        let images = null
        type ?
            images = await this.imageService.getAllByType ( type )
            :
            images = await this.imageService.findAll ();
        images.forEach ( image => {
            image.url = `http://${ host }/image/${ image._id }`;
        } );
        return res.send ( images );
    }

    @Get ( ':id' )
    async getImage( @Res () res, @Body () body, @Param ( 'id' ) id ) {
        const image = await this.imageService.getById ( id );
        res.setHeader ( 'Content-Type', image.image_file.contentType );
        return res.send ( image.image_file.data.buffer );
    }

    @Get ( '/name/:name' )
    async getImageByName( @Res () res, @Query () query, @Body () body, @Param ( 'name' ) name ) {

        const image = await this.imageService.getByName ( name );
        if ( !query.type ) {
            res.setHeader ( 'Content-Type', image.image_file.contentType );
            return res.send ( image.image_file.data.buffer );
        } else {
            if ( query?.type === 'encoded' ) {
                res.setHeader ( 'Content-Type', 'application/text' );
                return res.send ( 'data:image/png;base64,' + ( image.image_file.data.buffer as Buffer ).toString ( 'base64' ) );
            }
        }
    }

    @Get ( '' )
    async getImages( @Req () req, @Res () res ) {
        const host = req.get ( 'host' );
        const images = await this.imageService.findAll ();

        images.forEach ( image => {
            image.url = `http://${ host }/image/${ image._id }`;
        } );

        return res.send ( images );
    }
}
