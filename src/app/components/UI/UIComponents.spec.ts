import { basicComponentTestFor } from '../../../test/test-utils';
import { BadgeComponent } from './badge.component';
import { CatalogButtonComponent } from './catalog-button.component';
import { FaderComponent } from './fader.component';
import { NavButtonComponent } from './nav-button.component';
import { SectionHeadComponent } from './section-head.component';
import { SeparatorComponent } from './separator.component';
import { SliderComponent } from './slider.component';

basicComponentTestFor(BadgeComponent);
basicComponentTestFor(CatalogButtonComponent, { withRouter: true });
basicComponentTestFor(FaderComponent);
basicComponentTestFor(NavButtonComponent, { withRouter: true });
basicComponentTestFor(SectionHeadComponent);
basicComponentTestFor(SeparatorComponent);
basicComponentTestFor(SliderComponent);
