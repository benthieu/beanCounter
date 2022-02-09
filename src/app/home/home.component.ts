import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, tap} from 'rxjs';
import {ElectronService} from '../core/services';
import {DownloadHandlerService, DownloadStatus} from '../core/services/download-handler.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit {
  public youtubeURL: string;
  public fieldFocused = false;
  public inputValid = false;
  public loaderStatus$: Observable<Array<DownloadStatus>>;
  public lastCount = 0;
  
  constructor(private router: Router,
    private downloadHandlerService: DownloadHandlerService,
    private electronService: ElectronService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loaderStatus$ = this.downloadHandlerService.getLoaderStatus().pipe(
      tap((changes) => {
        console.log('changes', changes);
        // this.cd.detectChanges();
        if (changes.length !== this.lastCount) {
          this.lastCount = changes.length;
          this.electronService.ipcRenderer.send('resize', {
            count: this.lastCount
          });
        }
      })
    );
  }

  public fieldFocus(): void {
    this.fieldFocused = true;
  }

  public fieldBlur(): void {
    if (!this.youtubeURL) {
      this.fieldFocused = false;
      this.inputValid = false;
    } else {
      this.inputValid = true;
    }
  }

  public download(): void {
    this.downloadHandlerService.startDownload(this.youtubeURL);
    this.youtubeURL = '';
    this.fieldBlur();
  }

  public deleteDownload(uuid: string): void {
    this.downloadHandlerService.deleteStatus(uuid);
  }

}
