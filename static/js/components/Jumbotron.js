// @flow
/* global SETTINGS: false */
import React from 'react';
import Grid, { Cell } from 'react-mdl/lib/Grid';

import ProfileImage from '../containers/ProfileImage';
import type { Profile } from '../flow/profileTypes';

class Jumbotron extends React.Component {
  props: {
    profile:      Profile,
    text:         string,
    children?:    React$Element<*>[],
  };

  render() {
    const { profile, text } = this.props;
    return <div className="card jumbotron">
      <Grid className="card-user">
        <Cell col={2} className="card-image-box">
          <ProfileImage profile={profile} />
        </Cell>
        <Cell col={5} className="card-name">
          { text }
          <div className="card-student-id">
            ID: { profile.pretty_printed_student_id }
          </div>
        </Cell>
      </Grid>
      { this.props.children }
    </div>;
  }
}

export default Jumbotron;
