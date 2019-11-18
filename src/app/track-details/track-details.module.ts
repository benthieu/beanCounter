import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TrackDetailsComponent} from './track-details.component';
import {MatButtonModule, MatIconModule} from '@angular/material';



@NgModule({
  declarations: [TrackDetailsComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [TrackDetailsComponent]
})
export class TrackDetailsModule { }
