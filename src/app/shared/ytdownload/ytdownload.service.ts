import {Injectable} from '@angular/core';
import * as YoutubeMp3Downloader from 'youtube-mp3-downloader';
import {ElectronService} from '../../core/services';
const ffmpeg = require('ffmpeg-static');
const appRootDir = require('app-root-dir').get();


@Injectable({
  providedIn: 'root'
})
export class YTDownloadService {

  private downloader: YoutubeMp3Downloader;
  constructor(private electronService: ElectronService) {
    this.downloader = new YoutubeMp3Downloader({
      'ffmpegPath': `${appRootDir}/node_modules/ffmpeg-static/bin/darwin/x64/ffmpeg`,
      'outputPath': this.electronService.remote.app.getAppPath(),
      'youtubeVideoQuality': 'highest',
      'queueParallelism': 2,
      'progressTimeout': 2000
    });
  }

  public download(link: string): void {
    this.downloader.download(link, 'test.mp3');
    this.downloader.on('finished', function (err, data) {
      console.log(JSON.stringify(data));
    });

    this.downloader.on('error', function (error) {
      console.log(error);
    });

    this.downloader.on('progress', function (progress) {
      console.log(JSON.stringify(progress));
    });
  }
}
