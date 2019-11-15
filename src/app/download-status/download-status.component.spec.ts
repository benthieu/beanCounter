import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadStatusComponent } from './download-status.component';

describe('DownloadStatusComponent', () => {
  let component: DownloadStatusComponent;
  let fixture: ComponentFixture<DownloadStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
