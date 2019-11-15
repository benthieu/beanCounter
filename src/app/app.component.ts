import {CdkDragMove, CdkDragEnd, CdkDragStart} from '@angular/cdk/drag-drop';
import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {Observable, of} from 'rxjs';
import {tap, map, switchMap} from 'rxjs/operators';
import {AppConfig} from '../environments/environment';
import {ElectronService} from './core/services';
import {TrackService, Track} from './shared/track/track.service';
import {YTDownloadService, downloadStatus, DownloadWatcher} from './shared/ytdownload/ytdownload.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {AddLinkComponent} from './add-link/add-link.component';
import {DownloadManagerService} from './shared/download-manager/download-manager.service';

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
    private _bottomSheet: MatBottomSheet,
    private downloadManagerService: DownloadManagerService
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
    this.trackService.loadFromStorage().then(() => {
      this.trackList$ = this.trackService.getTracks();
      this.downloadManagerService.startWatching();
    });
  }

  public addTrack(): void {
    // this.trackService.newTrack('test');
    this._bottomSheet.open(AddLinkComponent);
  }

  public seperatorMoved(event: CdkDragMove): void {
    let calculated = window.innerWidth - event.pointerPosition.x;
    calculated = calculated < 300 ? 300 : calculated;
    this.renderer.setStyle(this.elRef.nativeElement, 'grid-template-columns', `auto 2px ${calculated}px`);
  }

  public seperatorMoveStart(event: CdkDragStart): void {
    this.renderer.addClass(this.elRef.nativeElement, 'seperatorMoving');
  }

  public seperatorMoveEnd(event: CdkDragEnd): void {
    this.renderer.removeClass(this.elRef.nativeElement, 'seperatorMoving');
    event.source.reset();
  }
}
