import {CdkDragMove, CdkDragEnd, CdkDragStart} from '@angular/cdk/drag-drop';
import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {AppConfig} from '../environments/environment';
import {ElectronService} from './core/services';
import {TrackService, Track} from './shared/track/track.service';
import {YTDownloadService} from './shared/ytdownload/ytdownload.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public trackList$: Observable<Array<Track>>;

  constructor(
    public electronService: ElectronService,
    private trackService: TrackService,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private ytdownload: YTDownloadService
  ) {
    console.log('AppConfig', AppConfig);

    if (electronService.isElectron) {
      console.log(process.env);
      console.log('Mode electron');
      console.log('Electron ipcRenderer', electronService.ipcRenderer);
      console.log('NodeJS childProcess', electronService.childProcess);
    } else {
      console.log('Mode web');
    }
  }

  ngOnInit() {
    this.trackList$ = this.trackService.getTracks().pipe(
      tap((tracks) => console.log('tracks', tracks))
    );
  }

  public addTrack(): void {
    this.trackService.newTrack('test');
  }

  public seperatorMoved(event: CdkDragMove): void {
    this.renderer.setStyle(this.elRef.nativeElement, 'grid-template-columns', `${event.pointerPosition.x}px 2px auto`);
  }

  public seperatorMoveStart(event: CdkDragStart): void {
    this.renderer.addClass(this.elRef.nativeElement, 'seperatorMoving');
  }

  public seperatorMoveEnd(event: CdkDragEnd): void {
    this.renderer.removeClass(this.elRef.nativeElement, 'seperatorMoving');
    event.source.reset();
  }
}
