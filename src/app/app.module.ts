import {DragDropModule} from '@angular/cdk/drag-drop';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatBottomSheetModule, MatIconModule, MatToolbarModule, MatTooltipModule} from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DEFAULT_OPTIONS} from '@angular/material/dialog';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import 'reflect-metadata';
import '../polyfills';
import {AddLinkModule} from './add-link/add-link.module';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {SharedModule} from './shared/shared.module';
import {DownloadStatusModule} from './download-status/download-status.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    DragDropModule,
    MatBottomSheetModule,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    DownloadStatusModule,
    AddLinkModule
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
