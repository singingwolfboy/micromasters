/* global SETTINGS */
import React from 'react';
import { connect } from 'react-redux';
import Tabs from 'react-mdl/lib/Tabs/Tabs';
import Tab from 'react-mdl/lib/Tabs/Tab';
import { browserHistory } from 'react-router';

import {
  startProfileEdit,
  updateProfile,
  validateProfile,
  clearProfileEdit,
  saveProfile,
} from '../actions';

class ProfilePage extends React.Component {
  updateProfile(isEdit, profile) {
    const { dispatch } = this.props;

    if (!isEdit) {
      dispatch(startProfileEdit());
    }
    dispatch(updateProfile(profile));
  }

  saveProfile(isEdit, profile) {
    const { dispatch } = this.props;
    if (!isEdit) {
      // Validation errors will only show up if we start the edit
      dispatch(startProfileEdit());
    }
    return dispatch(saveProfile(SETTINGS.username, profile)).then(() => {
        dispatch(clearProfileEdit());
      });
  }

  makeTabs () {
    return this.props.route.childRoutes.map( (route) => (
      <Tab
        key={route.path}
        onClick={() => browserHistory.push(`/profile/${route.path}`)} >
        {route.path}
      </Tab>
    ));
  }

  activeTab () {
    return this.props.route.childRoutes.findIndex( (route) => (
      route.path === this.props.location.pathname.split("/")[2]
    ));
  }

  render() {
    let { profile } = this.props;
    let errors, isEdit;

    if (profile.edit !== undefined) {
      errors = profile.edit.errors;
      profile = profile.edit.profile;
      isEdit = true;
    } else {
      profile = profile.profile;
      errors = {};
      isEdit = false;
    }

    let childrenWithProps = React.Children.map(this.props.children, (child) => (
      React.cloneElement(child, {
        profile: profile,
        errors: errors,
        updateProfile: this.updateProfile.bind(this, isEdit),
        saveProfile: this.saveProfile.bind(this, isEdit)
      })
    ));

    return <div className="card">
      <div className="card-copy">
        <h1>Enroll in MIT Micromasters</h1>
        <p>
          Please tell us more about yourself so you can participate in the
          micromasters community and qualify for your micromasters certificate.
        </p>
        <Tabs activeTab={this.activeTab()}>
          {this.makeTabs()}
        </Tabs>
        <section>
          {this.props.children && childrenWithProps}
        </section>
      </div>
    </div>;
  }
}

ProfilePage.propTypes = {
  profile:    React.PropTypes.object.isRequired,
  children:   React.PropTypes.node,
  dispatch:   React.PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.userProfile
});

export default connect(mapStateToProps)(ProfilePage);
