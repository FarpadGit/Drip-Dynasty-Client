import { Component, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

// extracts numeric value from formatted text like 19699 from "19 699 Ft"
export function getNumberValueFromText(text: string) {
  return Number.parseFloat(text.replace(/\s/g, ''));
}

type optionsType = {
  withAnimations?: boolean;
  withRouter?: boolean;
};
// minimal 'should create' test for a given component
export function basicComponentTestFor<T>(
  componentClass: Type<T>,
  options?: optionsType
) {
  return describe(componentClass.name, () => {
    let component: T;
    let fixture: ComponentFixture<T>;

    const providers: any[] = [];
    if (options?.withAnimations) providers.push(provideNoopAnimations());
    if (options?.withRouter) providers.push(provideRouter([]));

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [componentClass],
        providers,
      }).compileComponents();

      fixture = TestBed.createComponent(componentClass);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
}

// minimal 'should create' test for a given directive and the template the test host should have
export function basicDirectiveTestFor<T>(
  directiveClass: Type<T>,
  template: string
) {
  return describe(directiveClass.name, () => {
    @Component({
      selector: 'test-component',
      standalone: true,
      imports: [directiveClass],
      template,
    })
    class TestComponent {}

    let fixture: ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [TestComponent, directiveClass],
      }).compileComponents();

      fixture = TestBed.createComponent(TestComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create an instance', () => {
      const directive = new directiveClass(fixture.elementRef);

      expect(directive).toBeTruthy();
    });
  });
}
