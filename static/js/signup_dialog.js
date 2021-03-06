/* global SETTINGS: false */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import {
  setDialogVisibility,
  setProgram,
} from './actions/signup_dialog';
import { signupDialogStore } from './store/configureStore';
import SignupDialog from './containers/SignupDialog';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const store = signupDialogStore();

const dialogDiv = document.querySelector('#signup-dialog');

const openDialog = () => store.dispatch(setDialogVisibility(true));

// find the DOM element and attach openDialog to onClick
const signInButton = document.querySelector('.open-signup-dialog');

if ( signInButton ) {
  signInButton.onclick = openDialog;
}

if ( typeof SETTINGS.programId === 'number' ) {
  store.dispatch(setProgram(SETTINGS.programId));
}

ReactDOM.render(
  <MuiThemeProvider muiTheme={getMuiTheme()}>
    <Provider store={store}>
      <SignupDialog />
    </Provider>
    </MuiThemeProvider>,
  dialogDiv
);
