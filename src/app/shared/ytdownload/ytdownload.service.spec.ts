import { TestBed } from '@angular/core/testing';

import { YTDownloadService } from './ytdownload.service';

describe('YTDownloadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YTDownloadService = TestBed.get(YTDownloadService);
    expect(service).toBeTruthy();
  });
});
