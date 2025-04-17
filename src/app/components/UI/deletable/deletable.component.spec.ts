import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletableComponent } from './deletable.component';

describe('DeletableComponent', () => {
  let component: DeletableComponent;
  let fixture: ComponentFixture<DeletableComponent>;
  let XButton: HTMLButtonElement;
  let overlay: HTMLDivElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeletableComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletableComponent);
    component = fixture.componentInstance;
    component.deleteState = false;
    XButton = fixture.debugElement.nativeElement.querySelector(
      '[data-test-x-button]'
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an "X" button if delete state is false', () => {
    expect(XButton).toBeTruthy();
  });

  it('should show overlay if delete state is true', () => {
    component.deleteState = true;
    fixture.detectChanges();

    overlay = fixture.debugElement.nativeElement.querySelector(
      '[data-test-overlay]'
    );

    expect(overlay).toBeTruthy();
  });

  it('should change delete state if "X" button is pressed', (done) => {
    component.onDelete.subscribe((e) => {
      expect(e).toBe(true);
      done();
    });
    XButton.click();
    fixture.detectChanges();
  });

  it('should revert delete state if "Revert back" button is pressed on overlay', (done) => {
    component.onDelete.subscribe((e) => {
      expect(e).toBe(false);
      done();
    });
    component.deleteState = true;
    fixture.detectChanges();

    overlay = fixture.debugElement.nativeElement.querySelector(
      '[data-test-overlay]'
    );
    (overlay.querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
  });
});
