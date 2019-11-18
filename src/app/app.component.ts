import {CdkDragEnd, CdkDragMove, CdkDragStart} from '@angular/cdk/drag-drop';
import {Component, ElementRef, OnInit, Renderer2} from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {Observable} from 'rxjs';
import {AppConfig} from '../environments/environment';
import {AddLinkComponent} from './add-link/add-link.component';
import {ElectronService} from './core/services';
import {DownloadManagerService} from './shared/download-manager/download-manager.service';
import {SettingsService} from './shared/settings/settings.service';
import {Track, TrackService} from './shared/track/track.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public trackList$: Observable<Array<Track>>;
  public downloadFolder: string;

  constructor(
    public electronService: ElectronService,
    private trackService: TrackService,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private _bottomSheet: MatBottomSheet,
    private downloadManagerService: DownloadManagerService,
    private settingsService: SettingsService
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
    this.trackList$ = this.trackService.getTracks();
    this.downloadManagerService.startWatching();
    this.trackService.loadFromStorage();
    this.settingsService.loadFromStorage();
    this.settingsService.getSetting('downloadFolder').subscribe((folder: string) => {
      console.log('downloadFolder', folder);
      this.downloadFolder = folder;
    });
  }

  public addTrack(): void {
    this._bottomSheet.open(AddLinkComponent);
  }

  public selectFolder(): void {
    this.electronService.dialog.showOpenDialog(this.electronService.remote.getCurrentWindow(), {
      properties: ['openDirectory']
    }).then((folder: Electron.OpenDialogReturnValue) => {
      if (folder.filePaths[0]) {
        this.settingsService.setSetting('downloadFolder', folder.filePaths[0]);
      }
    });
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

  public activateTrack(track: Track): void {
    this.trackService.activateTrack(track);
  }
}
