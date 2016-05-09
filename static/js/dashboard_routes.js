import React from 'react';
import { Route, Router, IndexRedirect } from 'react-router';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import App from './containers/App';
import DashboardPage from './containers/DashboardPage';
import ProfilePage from './containers/ProfilePage';
import PersonalTab from './components/PersonalTab';
import EmploymentTab from './components/EmploymentTab';
import PrivacyTab from './components/PrivacyTab';
import TermsOfServicePage from './containers/TermsOfServicePage';

/**
 * Create the dashboard routes (the root React elements to be rendered into our container)
 *
 * @param browserHistory A browserHistory object
 * @param store The redux store to be used
 * @param onRouteUpdate {function} Function called when the route changes
 * @returns {ReactElement}
 */
export function makeDashboardRoutes(browserHistory, store, onRouteUpdate) {
  return <div>
    <MuiThemeProvider muiTheme={getMuiTheme()}>
      <Provider store={store}>
        <Router history={browserHistory} onUpdate={onRouteUpdate}>
          <Route path="/" component={App}>
            <Route path="dashboard" component={DashboardPage} />
            <Route path="profile" component={ProfilePage}>
              <IndexRedirect to="personal" />
              <Route path="personal" component={PersonalTab} />
              <Route path="professional" component={EmploymentTab} />
              <Route path="privacy" component={PrivacyTab} />
            </Route>
            <Route path="/terms_of_service" component={TermsOfServicePage} />
          </Route>
        </Router>
      </Provider>
    </MuiThemeProvider>
  </div>;
}
