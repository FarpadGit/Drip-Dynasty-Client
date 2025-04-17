import { basicDirectiveTestFor } from '../../../test/test-utils';
import { ButtonDirective } from './button.directive';
import { HeaderDirective } from './header.directive';
import { InputDirective } from './input.directive';
import { LabelDirective } from './label.directive';
import { TextareaDirective } from './textarea.directive';

basicDirectiveTestFor(
  ButtonDirective,
  `<button class="ui-button" [variant]="'leading'"></button>`
);
basicDirectiveTestFor(HeaderDirective, `<div class="ui-header"></div>`);
basicDirectiveTestFor(InputDirective, `<input class="ui-input" />`);
basicDirectiveTestFor(LabelDirective, `<div class="ui-label"></div>`);
basicDirectiveTestFor(
  TextareaDirective,
  `<textarea class="ui-textarea"></textarea>`
);
