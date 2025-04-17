import { Component } from '@angular/core';
import { ImageFallbackDirective } from './image-fallback.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('ImageFallbackDirective', () => {
  @Component({
    selector: 'test-image',
    standalone: true,
    imports: [ImageFallbackDirective],
    template: ` <img app-fallback [src]="'fake_src.jpg'" alt="" /> `,
  })
  class TestComponent {}

  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent, ImageFallbackDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new ImageFallbackDirective();

    expect(directive).toBeTruthy();
  });

  it('should replace image with fallback on error', async () => {
    const image = fixture.debugElement.nativeElement.querySelector(
      'img'
    ) as HTMLImageElement;

    expect(image.src.includes('fake_src.jpg')).toBeTrue();

    image.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(image.src.includes('fake_src.jpg')).toBeFalse();
  });
});
