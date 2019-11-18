import {Injectable} from '@angular/core';
import {Track, TrackService} from '../track/track.service';
import {downloadStatus, YTDownloadService} from '../ytdownload/ytdownload.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadManagerService {

  constructor(private trackService: TrackService,
    private ytDownloadService: YTDownloadService) {
  }

  startWatching() {
    this.trackService.getTracks().subscribe((tracks: Array<Track>) => {
      tracks = JSON.parse(JSON.stringify(tracks));
      const progressing = tracks.find((track: Track) => track.state === downloadStatus.PROGRESS);
      console.log('progressing', progressing);
      if (!progressing) {
        const nextTrack = tracks.find((track: Track) => track.state === downloadStatus.UNINITIALIZED);
        console.log('nextTrack', nextTrack);
        if (nextTrack) {
          this.startAndWatchDownload(nextTrack);
        }
      }
    });
  }

  startAndWatchDownload(track: Track): void {
    this.ytDownloadService.download(track.link).status
      .subscribe(([status, data]) => {
        let toDisk = true;
        track.state = status;
        console.log('status', status);
        console.log('data', data);
        if (status === downloadStatus.PROGRESS) {
          track.progress = data.progress.percentage;
          toDisk = false;
        }
        if (status === downloadStatus.FINISHED) {
          track.artist = data.artist ? data.artist : 'Unknown';
          track.title = data.title ? data.title : 'Unknown';
        }
        this.trackService.updateTrack(track, toDisk);
      });
  }
}
