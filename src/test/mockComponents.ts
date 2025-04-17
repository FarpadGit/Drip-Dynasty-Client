import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-product-card',
  standalone: true,
  template: ``,
})
export class MockProductCardComponent {
  @Input() product: any;
  @Input() animDelay: any;
}

@Component({
  selector: 'ui-nav-button',
  standalone: true,
  template: `<ng-content />`,
})
export class MockNavButtonComponent {
  @Input() disabled: any;
  @Input() href: any;
  @Input() queryParams: any;
}

@Component({
  selector: 'ui-catalog-button',
  standalone: true,
  template: ``,
})
export class MockCatalogButtonComponent {}

@Component({
  selector: 'ui-paypal-button',
  standalone: true,
  template: ``,
})
export class MockPaypalButtonComponent {}

@Component({
  selector: 'ui-image',
  standalone: true,
  template: ``,
})
export class MockImageComponent {
  @Input() src: any;
}
