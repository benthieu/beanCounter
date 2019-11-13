import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {LocalStorageService} from '../local-storage/local-storage.service';
const uuidv4 = require('uuid/v4');

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private trackList = new BehaviorSubject<Array<Track>>([]);

  constructor(private localStorageService: LocalStorageService) {
    this.localStorageService.getStorage('trackList').then((storeData: Array<Track>) => {
      this.trackList.next(storeData);
    });
  }

  public getTracks(): Observable<Array<Track>> {
    return this.trackList.asObservable();
  }

  public setTracks(tracks: Array<Track>): void {
    this.trackList.next(tracks);
    this.localStorageService.setStorage('trackList', tracks);
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
}

export interface Track {
  id: string;
  description: string;
  createDate: number;
  sort: number;
}
