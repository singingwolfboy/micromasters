/* global SETTINGS:false */
__webpack_public_path__ = `http://${SETTINGS.host}:8078/`;  // eslint-disable-line no-undef, camelcase
import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';
import DashboardPage from './containers/DashboardPage';
import ProfilePage from './containers/ProfilePage';
import PersonalTab from './components/PersonalTab';
import EducationTab from './components/EducationTab';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import { Router, IndexRedirect, Route, browserHistory } from 'react-router';
import ga from 'react-ga';

// requirements for react-mdl which uses a modified version of material-design-lite
import 'style!css!react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';

// requirements for react-select
import 'style!css!react-select/dist/react-select.css';

// requirement for react-datepicker
import 'style!css!react-datepicker/dist/react-datepicker.css';

const store = configureStore();

let debug = SETTINGS.reactGaDebug === "true";
ga.initialize(SETTINGS.gaTrackingID, { debug: debug });

let debugTools;
if (process.env.NODE_ENV !== 'production') {
  debugTools = <DebugPanel top right bottom>
    <DevTools store={store} monitor={LogMonitor} visibleOnLoad={false}/>
  </DebugPanel>;
}

ReactDOM.render(
  <div>
    <Provider store={store}>
      <Router history={browserHistory}>
        <Route path="/" component={App} onUpdate={ga.pageview(window.location.pathname)}>
          <Route path="dashboard" component={DashboardPage} />
          <Route path="profile" component={ProfilePage}>
            <IndexRedirect to="personal" />
            <Route path="personal" component={PersonalTab} />
            <Route path="education" component={EducationTab}/>
          </Route>
        </Route>
      </Router>
    </Provider>
    {debugTools}
  </div>,
  document.getElementById("dashboard")
);
