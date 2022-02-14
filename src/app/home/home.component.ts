import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {ElectronService} from '../core/services';
import {DownloadHandlerService, YtDownload} from '../core/services/download-handler.service';

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
  public loaderStatus$: Observable<Array<YtDownload>>;
  public lastCount = 0;
  
  constructor(private downloadHandlerService: DownloadHandlerService,
    private electronService: ElectronService) { }

  ngOnInit(): void {
    this.loaderStatus$ = this.downloadHandlerService.getLoaderStatus().pipe(
      tap((changes) => {
        if (changes.length !== this.lastCount && changes.length <= 5) {
          this.lastCount = changes.length;
          this.electronService.ipcRenderer.send('resize', {
            height: 101+this.lastCount*104+(this.lastCount > 0 ? 20 : 0)
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

  public downloadVideo(): void {
    this.downloadHandlerService.startDownload(this.youtubeURL, true);
    this.youtubeURL = '';
    this.fieldBlur();
  }

  public deleteDownload(uuid: string): void {
    this.downloadHandlerService.deleteStatus(uuid);
  }

}
