import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigSpinnerComponent } from './spinner.component';

describe('BigSpinnerComponent', () => {
  let component: BigSpinnerComponent;
  let fixture: ComponentFixture<BigSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BigSpinnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BigSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
