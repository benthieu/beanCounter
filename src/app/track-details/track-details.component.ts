import {Component, OnInit} from '@angular/core';
import {Track, TrackService} from '../shared/track/track.service';
const fs = require('fs');

@Component({
  selector: 'app-track-details',
  templateUrl: './track-details.component.html',
  styleUrls: ['./track-details.component.scss']
})
export class TrackDetailsComponent implements OnInit {

  public activeTrack: Track;
  public fileSize: string;

  constructor(private trackService: TrackService) {}

  ngOnInit() {
    this.trackService.getActiveTrack().subscribe((track: Track) => {
      this.fileSize = '';
      this.activeTrack = track;
      if (track && track.filePath) {
        try {
          const size = fs.statSync(track.filePath).size;
          if (size) {
            this.fileSize = (size / (1024 * 1024)).toFixed(2) + ' Mb';
          }
        } catch (err) {
          console.log('it does not exist');
        }
      }
    });
  }

  deleteTrack(): void {
    this.trackService.deleteTrack(this.activeTrack);
  }

  playTrack(): void {
    this.trackService.playTrack(this.activeTrack);
  }

}
