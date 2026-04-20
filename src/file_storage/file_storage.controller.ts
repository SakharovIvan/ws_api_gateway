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
    return this.fileStorageService.create_bucket(data);
  }

  @Get(FILE_STORAGE_ROUTES.BUCKET)
  get_bucket(@Query() query: { name: string }): Promise<Bucket> {
    return this.fileStorageService.get_bucket(query.name);
  }

  @Delete(FILE_STORAGE_ROUTES.BUCKET)
  delete_bucket(@Query() query: { id: string }): Promise<void> {
    return this.fileStorageService.delete_bucket(query.id);
  }

  @Get(FILE_STORAGE_ROUTES.BUCKETS)
  get_buckets(@Query() data: Partial<Bucket>): Promise<Bucket[]> {
    return this.fileStorageService.get_buckets(data);
  }

  @Get(FILE_STORAGE_ROUTES.BUCKET + '/' + FILE_STORAGE_ROUTES.FILE)
  get_bucket_files_query(@Query() query: { name: string }): Promise<File[]> {
    return this.fileStorageService.get_bucket_files(query.name);
  }

  @Post(FILE_STORAGE_ROUTES.BUCKET + '/' + FILE_STORAGE_ROUTES.FILE + '/:id')
  @UseInterceptors(FileInterceptor('file'))
  upload_file(
    @UploadedFile() Buffered_file: BufferedFile,
    @Body() file: File,
    @Param('id') bucket_id: string,
  ): Promise<void> {
    return this.fileStorageService.upload_file_data(
      { ...Buffered_file, ...file },
      bucket_id,
    );
  }

  @Delete(FILE_STORAGE_ROUTES.BUCKET + '/' + FILE_STORAGE_ROUTES.FILE)
  delete_file(
    @Query() data: { file_id: string; bucket_id: string },
  ): Promise<void> {
    return this.fileStorageService.delete_file({
      file: { id: data.file_id },
      bucket_id: data.bucket_id,
    });
  }
}
