/* global SETTINGS: false */
import React from 'react';
import Grid, { Cell } from 'react-mdl/lib/Grid';

import { makeProfileImageUrl } from '../util/util';
import Footer from './Footer';

class Jumbotron extends React.Component {
  static propTypes = {
    profile:      React.PropTypes.object.isRequired,
    text:         React.PropTypes.string.isRequired,
    children:     React.PropTypes.object.isRequired,
  };

  render() {
    const { profile, text } = this.props;
    let imageUrl = makeProfileImageUrl(profile);
    return <div className="card">
      <Grid className="card-user">
        <Cell col={2} className="card-image-box">
          <img
            src={imageUrl}
            alt={`Profile image for ${SETTINGS.name}`}
            className="card-image"
            style={{
              marginLeft: "50px"
            }}
          />
        </Cell>
        <Cell col={5} className="card-name">
          { text }
          <div className="card-student-id">
            ID: { profile.pretty_printed_student_id }
          </div>
        </Cell>
      </Grid>
      { this.props.children }
      <Footer />
    </div>;
  }
}

export default Jumbotron;
