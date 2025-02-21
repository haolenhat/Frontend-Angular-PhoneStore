import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpnewComponent } from './spnew.component';

describe('SpnewComponent', () => {
  let component: SpnewComponent;
  let fixture: ComponentFixture<SpnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpnewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
