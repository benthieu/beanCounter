import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DownloadStatusComponent} from './download-status.component';



@NgModule({
  declarations: [DownloadStatusComponent],
  imports: [
    CommonModule
  ],
  exports: [DownloadStatusComponent]
})
export class DownloadStatusModule { }
