import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PlayerComponent} from './player.component';
import {MatIconModule, MatButtonModule, MatTooltipModule} from '@angular/material';



@NgModule({
  declarations: [PlayerComponent],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  exports: [PlayerComponent]
})
export class PlayerModule { }
