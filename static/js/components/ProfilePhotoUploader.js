import React from 'react';
import Dialog from 'material-ui/Dialog';
import { connnect } from 'react-redux';
import R from 'ramda';

const ProfilePhotoUploader = ({
  photoDialogOpen,
  setDialogVisibility
}) => {
  console.log(photoDialogOpen);
  return <Dialog
    open = {photoDialogOpen}
    className="photo-upload-dialog"
    onRequestClose={() => setDialogVisibility(false)}
    autoScrollBodyContent={true}
  />
};

export default ProfilePhotoUploader;
