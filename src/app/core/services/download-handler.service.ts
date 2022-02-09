import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {v4 as uuidv4} from 'uuid';
import {ElectronService} from '.';

@Injectable({
  providedIn: 'root'
})
export class DownloadHandlerService {
  private loaderStatus$ = new BehaviorSubject<Array<DownloadStatus>>([]);

  constructor(private electronService: ElectronService,
    private ngZone: NgZone) {
    this.electronService.ipcRenderer.on('downloadYTProcess', (event, data) => {
      this.updateOrCreateStatus({
        uuid: data.corrId,
        title: data.title,
        link: data.link,
        thumbnail: data.thumbnail,
        process: data.process ? data.process : 0,
        error: data.error ? data.error : ''
      });
    });
  }

  public startDownload(link: string): void {
    const newEntry = {
      uuid: uuidv4(),
      link: link,
      title: '',
      thumbnail: '',
      process: '0',
      error: ''
    };
    this.updateOrCreateStatus(newEntry);
    this.electronService.ipcRenderer.send('downloadYT', {
      link: link,
      corrId: newEntry.uuid
    });
  }

  public getLoaderStatus(): Observable<Array<DownloadStatus>> {
    return this.loaderStatus$.asObservable();
  }

  public updateOrCreateStatus(data: DownloadStatus): void {
    let status = this.loaderStatus$.getValue();
    const replaceIndex = status.findIndex((val) => val.uuid === data.uuid);
    if (replaceIndex != -1) {
      status[replaceIndex] = data;
    } else {
      status.push(data);
    }
    this.ngZone.run(() => {
      this.loaderStatus$.next(status);
    });
  }

  public deleteStatus(uuid: string): void {
    const filter = this.loaderStatus$.value.filter((val) => val.uuid !== uuid);

    this.ngZone.run(() => {
      this.loaderStatus$.next(filter);
    });
  }
}

export interface DownloadStatus {
  uuid: string;
  link: string;
  title: string;
  thumbnail: string;
  process: string;
  error: string;
}
