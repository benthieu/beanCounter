import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatFormFieldModule, MatInputModule, MatButtonModule, MatBottomSheetModule} from '@angular/material';
import {AddLinkComponent} from './add-link.component';
import {FormsModule} from '@angular/forms';



@NgModule({
  declarations: [AddLinkComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatBottomSheetModule
  ],
  exports: [AddLinkComponent],
  entryComponents: [AddLinkComponent]
})
export class AddLinkModule { }
