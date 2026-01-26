import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueDto, CreateVenueManagerDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { RequestWithAccount } from 'src/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { classToClassFromExist } from 'class-transformer';
import { Public } from 'src/authentication/public.guard';
const uploadDir = join(process.cwd(), 'images', 'uncompressed');

@Controller('venues')
export class VenuesController {
  constructor(private readonly venuesService: VenuesService) { }

  @Post()
  // @UseInterceptors(FileInterceptor('image', {
  //   storage: diskStorage({
  //     destination: uploadDir,
  //     filename: (req, file, cb) =>
  //       cb(null, `${uuidv4()}${extname(file.originalname)}`),
  //   }),
  // }),)
  create(
    @Req() request: RequestWithAccount,
    // @UploadedFile()
    // file: Express.Multer.File,
    @Body() createVenueDto: CreateVenueDto,
  ) {
    // console.log(file)
    // console.log({
    //   path: file.path,
    //   destination: file.destination,
    //   filename: file.filename,
    //   size: file.size,
    //   hasBuffer: !!file.buffer,
    // });
    // console.log(file)
    // console.log(createVenueDto)
    //need to write file to

    // console.log('Uploads will be stored at:', uploadDir);

    // return this.venuesService.create(request, file, createVenueDto);
    return this.venuesService.create(request, createVenueDto);
  }

  @Post('/manager')
  createVenueManager(
    @Req() request: RequestWithAccount,
    @Body() createVenueManagerDto: CreateVenueManagerDto
  ) {
    return this.venuesService.createVenueManager(request, createVenueManagerDto)
  }

  @Public()
  @Get('/count')
  findAccountCount() {
    return this.venuesService.getVenueCount();
  }

  @Get()
  findAll() {
    return this.venuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venuesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVenueDto: UpdateVenueDto) {
    return this.venuesService.update(+id, updateVenueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.venuesService.remove(+id);
  }
}
