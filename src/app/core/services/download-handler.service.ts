import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {v4 as uuidv4} from 'uuid';
import {ElectronService} from '.';

@Injectable({
  providedIn: 'root'
})
export class DownloadHandlerService {
  private loaderStatus$ = new BehaviorSubject<Array<YtDownload>>([]);

  constructor(private electronService: ElectronService,
    private ngZone: NgZone) {
    this.connectIPCEvents();
  }

  public startDownload(link: string, video = false): void {
    const newEntry = {
      uuid: uuidv4(),
      link: link,
      video: video
    };
    this.updateOrCreateStatus(newEntry);
    this.electronService.ipcRenderer.send('ytDownload-sender-start', newEntry);
  }

  public getLoaderStatus(): Observable<Array<YtDownload>> {
    return this.loaderStatus$.asObservable();
  }

  public updateOrCreateStatus(data: YtDownload): void {
    let status = this.loaderStatus$.getValue();
    const replaceIndex = status.findIndex((val) => val.uuid === data.uuid);
    if (replaceIndex != -1) {
      status[replaceIndex] = Object.assign(status[replaceIndex], data);
    } else {
      status.unshift(data);
    }
    this.ngZone.run(() => {
      this.loaderStatus$.next(status);
    });
  }

  public deleteStatus(uuid: string): void {
    this.electronService.ipcRenderer.send('ytDownload-sender-abort', {
      uuid: uuid
    });
    const filter = this.loaderStatus$.value.filter((val) => val.uuid !== uuid);
    this.ngZone.run(() => {
      this.loaderStatus$.next(filter);
    });
  }

  private connectIPCEvents(): void {
    this.electronService.ipcRenderer.on('ytDownload-info', (event, data) => {
      this.updateOrCreateStatus({
        uuid: data.uuid,
        status: DownloadStatus.STARTED,
        title: data.title,
        thumbnail: data.thumbnail,
        process: 0
      });
    });
    this.electronService.ipcRenderer.on('ytDownload-download', (event, data) => {
      this.updateOrCreateStatus({
        uuid: data.uuid,
        status: DownloadStatus.DOWNLOADING,
        process: data.process
      });
    });
    this.electronService.ipcRenderer.on('ytDownload-transcoding', (event, data) => {
      this.updateOrCreateStatus({
        uuid: data.uuid,
        status: DownloadStatus.TRANSCODING
      });
    });
    this.electronService.ipcRenderer.on('ytDownload-finished', (event, data) => {
      this.updateOrCreateStatus({
        uuid: data.uuid,
        status: DownloadStatus.FINISHED
      });
    });
    this.electronService.ipcRenderer.on('ytDownload-error', (event, data) => {
      this.updateOrCreateStatus({
        uuid: data.uuid,
        status: DownloadStatus.ERROR,
        error: data.error,
        process: 0
      });
    });
  }
}

export interface YtDownload {
  uuid: string;
  link?: string;
  title?: string;
  thumbnail?: string;
  process?: number;
  error?: string;
  video?: boolean;
  status?: DownloadStatus;
}

export enum DownloadStatus {
  STARTED = "started",
  DOWNLOADING = "downloading",
  TRANSCODING = "transcoding",
  FINISHED = "finished",
  ERROR = "error"
};
