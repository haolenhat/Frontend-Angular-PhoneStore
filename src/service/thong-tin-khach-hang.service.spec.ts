import { TestBed } from '@angular/core/testing';

import { ThongTinKhachHangService } from './thong-tin-khach-hang.service';

describe('ThongTinKhachHangService', () => {
  let service: ThongTinKhachHangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThongTinKhachHangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
