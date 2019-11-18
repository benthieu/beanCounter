import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Track} from '../shared/track/track.service';
import {downloadStatus} from '../shared/ytdownload/ytdownload.service';

@Component({
  selector: 'app-download-status',
  templateUrl: './download-status.component.html',
  styleUrls: ['./download-status.component.scss']
})
export class DownloadStatusComponent implements OnInit, OnChanges {

  @Input() state: downloadStatus;
  @Input() progress: number;
  public background: string;
  public output: string;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    this.updateOutput();
  }

  ngOnInit() {
    this.updateOutput();
  }

  private updateOutput() {
    this.background = 'white';
    this.output = '';
    if (this.state === downloadStatus.PROGRESS) {
      const percentage = Math.round(this.progress);
      this.background = `linear-gradient(90deg, rgb(34,195,55) ${percentage}%, rgb(255,255,255) ${percentage}%)`;
      this.output = `${percentage} %`;
    }
    if (this.state === downloadStatus.FINISHED) {
      this.background = 'rgb(34,195,55, 0.5)';
      this.output = 'Finished';
    }
    if (this.state === downloadStatus.ERROR) {
      this.background = '#ee3b3b';
      this.output = 'Error downloading';
    }
    if (this.state === downloadStatus.UNINITIALIZED) {
      this.background = '#bfbfbf';
      this.output = 'Will start soon';
    }
  }
}
