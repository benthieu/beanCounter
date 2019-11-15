import {Component, Input, OnInit} from '@angular/core';
import {Track} from '../shared/track/track.service';

@Component({
  selector: 'app-download-status',
  templateUrl: './download-status.component.html',
  styleUrls: ['./download-status.component.scss']
})
export class DownloadStatusComponent implements OnInit {

  @Input() track: Track;

  constructor() {}

  ngOnInit() {

  }
}
