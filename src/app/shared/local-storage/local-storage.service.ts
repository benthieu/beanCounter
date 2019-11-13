import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import * as Storage from 'electron-json-storage';
const uuidv4 = require('uuid/v4');

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  public setStorage(identifier: string, value: any): void {
    Storage.set(identifier, value, () => {});
  }

  public async getStorage(identifier: string): Promise<any> {
    return new Promise((resolve) => {
      Storage.get(identifier, (error, storageData: any) => {
        if (storageData && storageData.length) {
          return resolve(storageData);
        }
      });
    });
  }
}
