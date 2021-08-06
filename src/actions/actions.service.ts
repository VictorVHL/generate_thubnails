import { Injectable } from '@nestjs/common';
import { ActionsEntity } from '../actions/entities/actions.entities';
import { ActionCreateDto } from './dto/action.create.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as FfmpegCommand from 'fluent-ffmpeg';
import * as Cloud from '@google-cloud/storage';
import { join } from 'path/posix';
import { v4 as uuidv4 } from 'uuid';
import * as rimraf from 'rimraf';
const { Storage } = Cloud;

@Injectable()
export class ActionsService {
  async findById(jobId: string) {
    (process as any).db = (process as any)?.db || {};
    return (process as any).db[jobId];
  }

  async createAction({ status }: { status: string }) {
    (process as any).db = (process as any)?.db || {};

    const newJobId = uuidv4();
    const newJob = {
      status,
      jobId: newJobId,
    };

    (process as any).db[newJobId] = newJob;

    return newJob;
  }

  async setJobStatus(jobId: string, status: string) {
    (process as any).db = (process as any)?.db || {};
    (process as any).db[jobId].status = status;
  }

  async handleAction(body: ActionCreateDto) {
    const { type, ...data } = body;
    if (body.type === 'generate_thumbnails') {
      const newJob = await this.createAction({ status: 'in_progress' });
      this.handleGenerateThumbnails({ ...data, jobId: newJob.jobId });

      return newJob;
    }
  }

  async handleGenerateThumbnails({
    videoUrl,
    videoId,
    jobId,
  }: {
    videoUrl: string;
    videoId: string;
    jobId: string;
  }) {
    const result = await this.createScrinshots(videoUrl, videoId);
    if (result == 'done') {
      const images = fs.readdirSync(join(__dirname, './preview'));
      if (images && images.length > 0) {
        await this.uploadArrayImages(images, videoId);
        rimraf(join(__dirname, './preview'), function () { console.log("done"); });
        await this.setJobStatus(jobId, 'done');
      }
    }
  }

  async createScrinshots(videoUrl: string, videoId: string) {
    const result = new Promise(async (res, rej) => {
      FfmpegCommand(videoUrl)
        .inputFormat('mp4')
        .audioQuality(80)
        .screenshots({
          filename: `${videoId}-%s-seconds-w300.jpg`,
          folder: path.join(__dirname, './preview'),
          size: '300x?',
          count: 20,
        })
        .on('end', () => {
          return res('done');
        })
        .on('error', (err) => {
          return rej(new Error(err));
        });
    });
    return result;
  }

  async upload(videoId: string, image: string) {
    const serviceKey = './src/actions/single-obelisk-322006-267f69ae3e8f.json';

    const storage = new Storage({
      keyFilename: serviceKey,
      projectId: 'your project id',
    });

    const options = {
      destination: `${videoId}/${image}`,
      resumable: true,
      validation: 'crc32c',
      metadata: {
        metadata: {
          event: 'download',
        },
      },
    };
    return storage
      .bucket('my_bucket_name_victor')
      .upload(
        join(__dirname, `./preview/${image}`),
        options,
        function (err, file) {
          if (!err) console.log('upload Completed');
          else console.log('error => ', err);
        },
      );
  }
  async uploadArrayImages(images, videoId) {
    await images.forEach(async (element) => {
      await this.upload(videoId, element);
    });
  }
}
