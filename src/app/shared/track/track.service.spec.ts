import { TestBed } from '@angular/core/testing';

import { TrackService } from './track.service';

describe('TrackServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrackService = TestBed.get(TrackService);
    expect(service).toBeTruthy();
  });
});
