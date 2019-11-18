import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import * as YoutubeMp3Downloader from 'youtube-mp3-downloader';
import {ElectronService} from '../../core/services';
import {SettingsService} from '../settings/settings.service';
const appRootDir = require('app-root-dir').get();


@Injectable({
  providedIn: 'root'
})
export class YTDownloadService {

  private downloader: YoutubeMp3Downloader;
  private watchers: Array<DownloadWatcher>;

  constructor(private electronService: ElectronService,
    private settingsService: SettingsService) {
    this.watchers = [];
    this.downloader = new YoutubeMp3Downloader({
      'ffmpegPath': `${appRootDir}/node_modules/ffmpeg-static/bin/darwin/x64/ffmpeg`,
      'outputPath': ``,
      'youtubeVideoQuality': 'highest',
      'queueParallelism': 2,
      'progressTimeout': 2000
    });

    this.settingsService.getSetting('downloadFolder').subscribe((folder: string) => {
      (this.downloader as any).outputPath = folder;
    });

    this.downloader.on('finished', (error, data) => {
      const watcher = this.getWatcher(data.videoId);
      if (watcher) {
        watcher.status.next([downloadStatus.FINISHED, data]);
        watcher.status.complete();
      }
    });

    this.downloader.on('error', (error, data) => {
      let watcher = this.getLatestWatcher();
      if (data && data.videoId) {
        watcher = this.getWatcher(data.videoId);
      }
      if (watcher) {
        watcher.status.next([downloadStatus.ERROR, error]);
        watcher.status.complete();
      }
    });

    this.downloader.on('progress', (progress) => {
      const watcher = this.getWatcher(progress.videoId);
      if (watcher) {
        watcher.status.next([downloadStatus.PROGRESS, progress]);
      }
    });
  }

  public getWatcher(link: string): DownloadWatcher {
    return this.watchers.find(watcher => watcher.id === link);
  }
  public getLatestWatcher(): DownloadWatcher {
    return this.watchers[this.watchers.length - 1];
  }

  public download(link: string): DownloadWatcher {
    this.downloader.download(link, `${link}.mp3`);
    const watcher = new DownloadWatcher(link);
    this.watchers.push(watcher);
    return watcher;
  }
}

export enum downloadStatus {
  FINISHED = 1,
  ERROR = 2,
  PROGRESS = 3,
  UNINITIALIZED = 4
}

export class DownloadWatcher {
  public id: string;
  public status: BehaviorSubject<[downloadStatus, any]>;
  constructor(id: string) {
    this.id = id;
    this.status = new BehaviorSubject([
      downloadStatus.PROGRESS,
      {
        progress: {
          percentage: 0
        }
      }
    ]);
  }
}
