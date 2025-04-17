import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsComponent } from './options.component';
import { mockOptions } from '../../../../../test/mocks';

describe('OptionsComponent', () => {
  let component: OptionsComponent;
  let fixture: ComponentFixture<OptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OptionsComponent);
    component = fixture.componentInstance;
    component.options = mockOptions;
    component.isOpen = true;
    component.dialogOpen = false;
    component.options.forEach((o) => (o.error = undefined));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display button', () => {
    const button = fixture.debugElement.nativeElement.querySelector(
      'button'
    ) as HTMLButtonElement;

    expect(button).toBeTruthy();
  });

  it('should display options menu labels if open state is true', () => {
    const labels = fixture.debugElement.nativeElement.querySelectorAll(
      '[data-test-label]'
    ) as NodeList;

    expect(
      Array.from(labels).map((label) => label.textContent!.trim())
    ).toEqual(component.options.map((option) => option.label));
  });

  it('should not display options menu labels if open state is false', () => {
    component.isOpen = false;
    fixture.detectChanges();
    const labels = fixture.debugElement.nativeElement.querySelectorAll(
      '[data-test-label]'
    ) as NodeList;

    expect(labels.length).toBe(0);
  });

  it('should display dialog if open state is true and dialogOpen is an option ID', () => {
    const optionWithDialog = component.options.find((option) => option.dialog);
    component.dialogOpen = optionWithDialog!.id;
    fixture.detectChanges();
    const dialogElement = fixture.debugElement.nativeElement.querySelector(
      '[data-test-dialog]'
    ) as HTMLElement;

    expect(
      dialogElement.textContent!.includes(optionWithDialog?.dialog!)
    ).toBeTrue();
  });

  it('should display error message if open state is true and an option has an error field', () => {
    component.options[0].error = 'mock error';
    fixture.detectChanges();
    const errorElement = fixture.debugElement.nativeElement.querySelector(
      '[data-test-error]'
    ) as HTMLElement;

    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent!.trim()).toBe('mock error');
  });

  it('should send onUserSelect event with option ID if option is selected', (done) => {
    component.onUserSelect.subscribe((e) => {
      expect(e.id).toBe(component.options[0].id);

      done();
    });
    const labels = fixture.debugElement.nativeElement.querySelectorAll(
      '[data-test-label]'
    ) as NodeList;

    expect((labels.item(0) as HTMLButtonElement).textContent?.trim()).toBe(
      component.options[0].label
    );

    (labels.item(0) as HTMLButtonElement).click();
    fixture.detectChanges();
  });

  it('should send onDialogOpened event if option with confirm dialog is selected', (done) => {
    expect(component.dialogOpen).toBeFalse();

    component.onDialogOpened.subscribe((e) => {
      expect(e).toBeTrue();
      done();
    });
    const labels = fixture.debugElement.nativeElement.querySelectorAll(
      '[data-test-label]'
    ) as NodeList;
    const indexOfOptionWithDialog = component.options.findIndex(
      (option) => option.dialog !== undefined
    );
    (labels.item(indexOfOptionWithDialog) as HTMLButtonElement).click();
    fixture.detectChanges();
  });
});
