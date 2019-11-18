import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrackDetailsComponent} from './track-details.component';
import {MatButtonModule, MatIconModule, MatTooltipModule} from '@angular/material';



@NgModule({
  declarations: [TrackDetailsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  exports: [TrackDetailsComponent]
})
export class TrackDetailsModule { }
