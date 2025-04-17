import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberInputComponent } from './number-input.component';

describe('NumberInputComponent', () => {
  let component: NumberInputComponent;
  let fixture: ComponentFixture<NumberInputComponent>;
  let inputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumberInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberInputComponent);
    component = fixture.componentInstance;
    component.title = 'test';
    fixture.detectChanges();
    inputElement =
      fixture.debugElement.nativeElement.querySelector('#numberInput_test');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should display number with thousands separator', () => {
    inputElement.value = '1000';
    inputElement.dispatchEvent(new KeyboardEvent('keyup'));
    fixture.detectChanges();

    expect(component.numericValue).toBe(1000n);
    expect(component.maskedValue).toBe('1 000');

    inputElement.value = '123456789';
    inputElement.dispatchEvent(new KeyboardEvent('keyup'));
    fixture.detectChanges();

    expect(component.numericValue).toBe(123456789n);
    expect(component.maskedValue).toBe('123 456 789');
  });

  it('should not accept non-numeric inputs', () => {
    inputElement.value = 'testing789';
    inputElement.dispatchEvent(new KeyboardEvent('keyup'));
    fixture.detectChanges();

    expect(component.numericValue).toBe(1n);
    expect(component.maskedValue).toBe('1');
  });
});
