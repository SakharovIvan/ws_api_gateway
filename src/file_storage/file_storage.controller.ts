import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileStorageService } from './file_storage.service';
import type {
  Bucket,
  BufferedFile,
  File,
} from 'lib/WS_types/file_storage/types';
import {
  Bucket_func,
  FILE_STORAGE_ROUTES,
} from 'lib/WS_types/file_storage/interface';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(FILE_STORAGE_ROUTES.MAIN)
export class FileStorageController {
  constructor(private readonly fileStorageService: FileStorageService) {}

  @Post(FILE_STORAGE_ROUTES.BUCKET)
  create_bucket(@Body() data: Bucket): Promise<void> {
    console.log('create_bucket');
    return this.fileStorageService.create_bucket(data);
  }

  @Get(FILE_STORAGE_ROUTES.BUCKET)
  get_bucket(@Query() query: { name: string }): Promise<Bucket> {
    console.log('get_bucket');

    return this.fileStorageService.get_bucket(query.name);
  }

  @Delete(FILE_STORAGE_ROUTES.BUCKET)
  delete_bucket(@Query() query: { id: string }): Promise<void> {
    console.log('delete_bucket');
    return this.fileStorageService.delete_bucket(query.id);
  }

  @Get(FILE_STORAGE_ROUTES.BUCKETS)
  get_buckets(@Query() data: Partial<Bucket>): Promise<Bucket[]> {
    console.log('get_buckets');

    return this.fileStorageService.get_buckets(data);
  }

  @Get(FILE_STORAGE_ROUTES.BUCKET + '/' + FILE_STORAGE_ROUTES.FILE)
  get_bucket_files_query(@Query() query: { name: string }): Promise<File[]> {
    console.log('get_bucket_files', query.name);
    return this.fileStorageService.get_bucket_files(query.name);
  }

  @Post(FILE_STORAGE_ROUTES.BUCKET + '/' + FILE_STORAGE_ROUTES.FILE + '/:id')
  @UseInterceptors(FileInterceptor('file'))
  upload_file(
    @UploadedFile() file: BufferedFile,
    @Param('id') bucket_id: string,
  ): Promise<void> {
    console.log('upload file');
    return this.fileStorageService.upload_file_data(file, bucket_id);
  }

  @Delete(FILE_STORAGE_ROUTES.BUCKET + '/' + FILE_STORAGE_ROUTES.FILE)
  delete_file(@Body() data: { file: File; bucket_id: string }): Promise<void> {
    console.log('delete_file');
    return this.fileStorageService.delete_file(data);
  }
}
