import {Injectable, NgZone} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ElectronService} from '../../core/services';
import {LocalStorageService} from '../local-storage/local-storage.service';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private settings$ = new BehaviorSubject<Settings>({} as Settings);
  private settings: Settings;

  constructor(private electronService: ElectronService,
    private localStorageService: LocalStorageService,
    private _ngZone: NgZone) {
    this.settings = {
      'downloadFolder': this.electronService.remote.app.getPath('downloads'),
      'contentWidth': 300
    } as Settings;
    this.settings$.next(this.settings);
  }

  public loadFromStorage(): Promise<any> {
    return new Promise((resolve) => {
      this.localStorageService.getStorage('settings').then((storeData: Settings) => {
        this.settings = storeData;
        this.settings$.next(storeData);
        resolve();
      });
    });
  }

  public getSettings(): Observable<Settings> {
    return this.settings$.asObservable();
  }

  public getSetting(setting: string): Observable<string> {
    return this.settings$.pipe(
      switchMap((settings: Settings) => {
        return of(settings[setting]);
      })
    );
  }

  public setSetting(setting: string, value: any): void {
    this.settings[setting] = value;
    this.localStorageService.setStorage('settings', this.settings);
    this._ngZone.run(() => {
      this.settings$.next(this.settings);
    });
  }
}

export interface Settings {
  downloadFolder: string;
  contentWidth: number;
}
