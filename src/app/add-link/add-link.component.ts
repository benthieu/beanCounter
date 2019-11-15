import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {MatBottomSheetRef, MatInput} from '@angular/material';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {TrackService} from '../shared/track/track.service';

@Component({
  selector: 'app-add-link',
  templateUrl: './add-link.component.html',
  styleUrls: ['./add-link.component.scss']
})
export class AddLinkComponent implements OnInit, OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('linkRef', {static: false}) linkRef: ElementRef;
  public link: string;

  constructor(private _bottomSheetRef: MatBottomSheetRef<AddLinkComponent>,
    private trackService: TrackService) {
    this._bottomSheetRef.afterOpened().pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.linkRef.nativeElement.focus();
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public addLink(): void {
    const validatedLink = this.youtube_parser(this.link);
    if (validatedLink) {
      this.trackService.newTrack(validatedLink.toString());
    }
    this._bottomSheetRef.dismiss();
  }

  private youtube_parser(url: string): string | boolean {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  }
}
