import { TestBed } from '@angular/core/testing';

import { DownloadHandlerService } from './download-handler.service';

describe('DownloadHandlerService', () => {
  let service: DownloadHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
