import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {LocalStorageService} from '../local-storage/local-storage.service';
import {downloadStatus} from '../ytdownload/ytdownload.service';
import {switchMap} from 'rxjs/operators';
const uuidv4 = require('uuid/v4');

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private trackList = new BehaviorSubject<Array<Track>>([]);
  private tracks: Array<Track>;
  public activatedTrack: string;
  public playingTrack: string;

  constructor(private localStorageService: LocalStorageService,
    private _ngZone: NgZone) {
    this.tracks = [] as Array<Track>;
  }

  public loadFromStorage(): Promise<any> {
    return new Promise((resolve) => {
      this.localStorageService.getStorage('trackList').then((storeData: Array<Track>) => {
        this.tracks = storeData;
        this.trackList.next(storeData);
        resolve();
      });
    });
  }

  public activateTrack(track: Track): void {
    this.activatedTrack = track.id;
    this.trackList.next(this.tracks);
  }

  public playTrack(track: Track): void {
    this.playingTrack = track.id;
    this.trackList.next(this.tracks);
  }

  public playActivatedTrack(): void {
    this.playingTrack = this.activatedTrack;
    this.trackList.next(this.tracks);
  }

  public unsetPlayingTrack(): void {
    this.playingTrack = '';
    this.trackList.next(this.tracks);
  }

  public getTracks(): Observable<Array<Track>> {
    return this.trackList.asObservable();
  }

  public getActiveTrack(): Observable<Track> {
    return this.trackList.pipe(
      switchMap((tracks: Array<Track>) => {
        return of(tracks.find((track: Track) => track.id === this.activatedTrack));
      })
    );
  }

  public getPlayingTrack(): Observable<Track> {
    return this.trackList.pipe(
      switchMap((tracks: Array<Track>) => {
        return of(tracks.find((track: Track) => track.id === this.playingTrack));
      })
    );
  }

  public setTracks(updateStorage: boolean = true): void {
    if (updateStorage) {
      this.localStorageService.setStorage('trackList', this.tracks);
    }
    this._ngZone.run(() => {
      this.trackList.next(this.tracks);
    });
  }

  public removeTracks(): void {
    this.localStorageService.setStorage('trackList', []);
    this._ngZone.run(() => {
      this.trackList.next([]);
    });
  }

  public deleteTrack(track: Track, updateStorage: boolean = true): void {
    this.tracks = this.tracks.filter((filter: Track) => filter.id !== track.id);
    this.setTracks(updateStorage);
  }

  public updateTrack(track: Track, updateStorage: boolean = true): void {
    this.tracks = this.tracks.map((search: Track) => {
      if (search.id === track.id) {
        return track;
      }
      return search;
    });
    this.setTracks(updateStorage);
  }

  public newTrack(link: string, updateStorage: boolean = true): void {
    this.tracks.push({
      link: link ? link : '',
      id: uuidv4(),
      createDate: Date.now(),
      state: downloadStatus.UNINITIALIZED
    });
    this.setTracks(updateStorage);
  }
}

export interface Track {
  id: string;
  link: string;
  createDate: number;
  length?: number;
  state?: downloadStatus;
  artist?: string;
  title?: string;
  progress?: number;
  filePath?: string;
}
