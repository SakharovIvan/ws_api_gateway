import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  Bucket_func,
  FILE_STORAGE_CMDS,
} from 'lib/WS_types/file_storage/interface';
import type {
  Bucket,
  BufferedFile,
  File,
} from 'lib/WS_types/file_storage/types';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FileStorageService implements Partial<Bucket_func> {
  constructor(
    @Inject('FILE_STORAGE_SERVICE')
    private readonly coreService: ClientProxy,
  ) {}
  async command(cmd, data: any): Promise<any> {
    console.log(cmd, data);
    const res = await lastValueFrom(this.coreService.send(cmd, data)).catch(
      (err) => {
        console.log(err);
        throw new HttpException(err.message, err.status | 400);
      },
    );
    return res;
  }
  async create_bucket(data: Partial<Bucket>): Promise<void> {
    return this.command(FILE_STORAGE_CMDS.create_bucket, data);
  }
  async get_bucket(id: string): Promise<Bucket> {
    return this.command(FILE_STORAGE_CMDS.get_bucket, id);
  }
  async delete_bucket(id: string): Promise<void> {
    return this.command(FILE_STORAGE_CMDS.delete_bucket, id);
  }
  async get_buckets(data: Partial<Bucket>): Promise<Bucket[]> {
    return this.command(FILE_STORAGE_CMDS.get_buckets, data);
  }
  async get_bucket_files(name: string): Promise<File[]> {
    console.log(name);
    return this.command(FILE_STORAGE_CMDS.get_bucket_files, name);
  }
  async upload_file_data(file: BufferedFile, bucket_id: string): Promise<void> {
    return this.command(FILE_STORAGE_CMDS.upload_file, { file, bucket_id });
  }
  async delete_file(data: { file: File; bucket_id: string }): Promise<void> {
    return this.command(FILE_STORAGE_CMDS.delete_file, data);
  }
}
