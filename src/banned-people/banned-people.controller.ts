import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BannedPeopleService } from './banned-people.service';
import { CreateBannedPersonDto } from './dto/create-banned-person.dto';
import { UpdateBannedPersonDto } from './dto/update-banned-person.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { RequestWithAccount } from 'src/types';
import { v4 as uuidv4 } from 'uuid';
const uploadDir = join(process.cwd(), 'images', 'uncompressed');

@Controller('banned-people')
export class BannedPeopleController {
  constructor(private readonly bannedPeopleService: BannedPeopleService) { }


  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) =>
          cb(null, `${uuidv4()}${extname(file.originalname)}`),
      }),
    }),
  )
  create(
    @Req() request: RequestWithAccount,
    @UploadedFile() file: Express.Multer.File,
    @Body() createBannedPersonDto: CreateBannedPersonDto,
  ) {
    return this.bannedPeopleService.create(
      request,
      file,
      createBannedPersonDto,
    );
  }


  @Get()
  findAll() {
    return this.bannedPeopleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannedPeopleService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBannedPersonDto: UpdateBannedPersonDto,
  ) {
    return this.bannedPeopleService.update(+id, updateBannedPersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bannedPeopleService.remove(+id);
  }
}
