import { basicComponentTestFor } from '../../../../test/test-utils';
import { NavbarComponent } from './navbar.component';
import { NavlinkComponent } from './navlink.component';

basicComponentTestFor(NavbarComponent);
basicComponentTestFor(NavlinkComponent, { withRouter: true });
