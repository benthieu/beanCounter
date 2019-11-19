import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {Track, TrackService} from '../shared/track/track.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  public playingTrack: Track;
  public trackPath: string;
  public duration = 0;
  public currentTime = '0:00:00';
  public circleAngle = 279;
  public isPlaying = false;
  private intervalWatcher;
  @ViewChild('audioElement', {static: false}) el: ElementRef;

  constructor(private trackService: TrackService) {
    this.trackService.getPlayingTrack().subscribe((track: Track) => {
      if (track && track !== this.playingTrack) {
        if (track.filePath) {
          this.playingTrack = track;
          this.trackPath = `file://${track.filePath}`;
          this.el.nativeElement.load();
          this.play();
        }
      }
    });
  }

  ngOnInit() {
  }

  replay10(): void {
    if (this.playingTrack) {
      let newCurrent = this.el.nativeElement.currentTime;
      newCurrent = newCurrent - 10;
      this.el.nativeElement.currentTime = newCurrent > 0 ? newCurrent : 0;
      this.setProgress();
    }
  }

  setProgress(): void {
    if (this.playingTrack) {
      this.currentTime = this.formatSeconds(this.el.nativeElement.currentTime);
      this.circleAngle = 279 - Math.round(this.el.nativeElement.currentTime / this.el.nativeElement.duration * 279 * 1000) / 1000;
    }
  }

  formatSeconds(time: number): string {
    // Hours, minutes and seconds
    const hrs = Math.floor(time / 3600);
    const mins = Math.floor((time % 3600) / 60);
    const secs = Math.floor(time % 60);
    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = '';
    ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
  }

  play(): void {
    if (this.playingTrack) {
      this.isPlaying = true;
      this.el.nativeElement.play();
      this.setProgress();
      this.intervalWatcher = setInterval(() => {
        this.setProgress();
      }, 1000);
    } else {
      if (this.trackService.activatedTrack) {
        this.trackService.playActivatedTrack();
      }
    }
  }

  pause(): void {
    if (this.playingTrack) {
      this.isPlaying = false;
      this.el.nativeElement.pause();
      clearInterval(this.intervalWatcher);
    }
  }

  stop(): void {
    // i don't know what i'm doing
    this.playingTrack = undefined;
    this.isPlaying = false;
    this.el.nativeElement.pause();
    this.trackService.unsetPlayingTrack();
    this.playingTrack = undefined;
    this.el.nativeElement.currentTime = 0;
    this.currentTime = this.formatSeconds(0);
    this.circleAngle = 279;
    clearInterval(this.intervalWatcher);
  }

}
