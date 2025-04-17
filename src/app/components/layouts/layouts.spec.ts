import { basicComponentTestFor } from '../../../test/test-utils';
import { AdminLayoutComponent } from './admin-layout.component';
import { customerLayoutComponent } from './customer-layout.component';

basicComponentTestFor(AdminLayoutComponent, { withRouter: true });
basicComponentTestFor(customerLayoutComponent, { withRouter: true });
