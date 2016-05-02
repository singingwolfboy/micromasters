import React from 'react';
import { Route, Router, IndexRedirect } from 'react-router';
import { Provider } from 'react-redux';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

import App from './containers/App';
import DashboardPage from './containers/DashboardPage';
import ProfilePage from './containers/ProfilePage';
import PersonalTab from './components/PersonalTab';
import EmploymentTab from './components/EmploymentTab';
import EducationTab from './components/EducationTab';
import TermsOfServicePage from './containers/TermsOfServicePage';

/**
 * Create the dashboard routes (the root React elements to be rendered into our container)
 *
 * @param browserHistory A browserHistory object
 * @param store The redux store to be used
 * @param onRouteUpdate {function} Function called when the route changes
 * @param addDebugPanel {bool} If true, add the debug panel
 * @returns {ReactElement}
 */
export function makeDashboardRoutes(browserHistory, store, onRouteUpdate, addDebugPanel) {
  let debugTools;
  if (addDebugPanel) {
    debugTools = <DebugPanel top right bottom>
      <DevTools store={store} monitor={LogMonitor} visibleOnLoad={false}/>
    </DebugPanel>;
  }

  return <div>
    <Provider store={store}>
      <Router history={browserHistory} onUpdate={onRouteUpdate}>
        <Route path="/" component={App}>
          <Route path="dashboard" component={DashboardPage} />
          <Route path="profile" component={ProfilePage}>
            <IndexRedirect to="personal" />
            <Route path="personal" component={PersonalTab} />
            <Route path="education" component={EducationTab}/>
            <Route path="professional" component={EmploymentTab} />
          </Route>
          <Route path="/terms_of_service" component={TermsOfServicePage} />
        </Route>
      </Router>
    </Provider>
    {debugTools}
  </div>;
}
