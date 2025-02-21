import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelPageComponent } from './cancel-page.component';

describe('CancelPageComponent', () => {
  let component: CancelPageComponent;
  let fixture: ComponentFixture<CancelPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CancelPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
