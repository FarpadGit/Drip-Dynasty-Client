import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchComponent } from './switch.component';

describe('SwitchComponent', () => {
  let component: SwitchComponent;
  let fixture: ComponentFixture<SwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle states on click ', () => {
    expect(component.checked).toBeFalse();

    const button = fixture.debugElement.nativeElement.querySelector(
      'button'
    ) as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(component.checked).toBeTrue();

    button.click();
    fixture.detectChanges();

    expect(component.checked).toBeFalse();
  });
});
