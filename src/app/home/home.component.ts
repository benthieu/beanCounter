import { Component, OnInit } from '@angular/core';
import {LocalStorageService, Track} from '../shared/local-storage.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public trackList$: Observable<Array<Track>>;

  constructor(private localStorageService: LocalStorageService) { }

  ngOnInit() {
    this.trackList$ = this.localStorageService.getTracks().pipe(
      tap((tracks) => console.log('tracks', tracks))
    );
  }

  public addTrack(): void {
    this.localStorageService.newTrack('test');
  }

}
