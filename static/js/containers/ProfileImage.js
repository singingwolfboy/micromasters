// @flow
/* global SETTINGS: false */
import React from 'react';
import { connect } from 'react-redux';
import Icon from 'react-mdl/lib/Icon';

import { makeProfileImageUrl, getPreferredName } from '../util/util';
import type { Profile } from '../flow/profileTypes';
import ProfileImageUploader from '../components/ProfileImageUploader';
import { createActionHelper } from '../util/redux';
import { setPhotoDialogVisibility } from '../actions/ui';

class ProfileImage extends React.Component {
  props: {
    profile: Profile,
    editable: boolean
  };

  static defaultProps = {
    editable: false
  };

  cameraIcon: Function = (editable: bool): React$Element<*>|null => {
    const { setDialogVisibility } = this.props;
    if ( editable ) {
      return <span className="img">
        <Icon name="camera_alt" onClick={() => setDialogVisibility(true)} />
        </span>;
    } else {
      return null;
    }
  }

  render () {
    const { profile, editable } = this.props;
    const imageUrl = makeProfileImageUrl(profile);

    return (
      <div className="avatar">
        <ProfileImageUploader {...this.props} />
        <img
          src={imageUrl}
          alt={`Profile image for ${getPreferredName(profile, false)}`}
          className="card-image"
        />
        { this.cameraIcon(editable) }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  photoDialogOpen: state.ui.photoDialogVisibility,
});

const mapDispatchToProps = dispatch => ({
  setDialogVisibility: createActionHelper(dispatch, setPhotoDialogVisibility)
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileImage);
