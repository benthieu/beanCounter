import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import * as Storage from 'electron-json-storage';
const uuidv4 = require('uuid/v4');

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private trackList = new BehaviorSubject<Array<Track>>([]);

  constructor() {
    this.getStorage().then((storeData: Array<Track>) => {
      this.trackList.next(storeData);
    });
  }

  public getTracks(): Observable<Array<Track>> {
    return this.trackList.asObservable();
  }

  public setTracks(tracks: Array<Track>): void {
    this.trackList.next(tracks);
    Storage.set('trackList', tracks, () => {});
  }

  public newTrack(description: string): void {
    this.trackList.value.push({
      description: description ? description : '',
      id: uuidv4(),
      createDate: Date.now(),
      sort: 0
    });
    this.setTracks(this.trackList.value);
  }

  public async getStorage(): Promise<Array<Track>> {
    return new Promise((resolve) => {
      Storage.get('trackList', (error, storageData: Array<Track>) => {
        if (storageData && storageData.length) {
          return resolve(storageData);
        }
      });
    });
  }
}

export interface Track {
  id: string;
  description: string;
  createDate: number;
  sort: number;
}
