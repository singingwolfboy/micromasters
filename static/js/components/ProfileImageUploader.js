import React from 'react';
import Dialog from 'material-ui/Dialog';
import { connnect } from 'react-redux';
import R from 'ramda';
import Dropzone from 'react-dropzone';

const onDrop = files => console.log(files);

const ProfileImageUploader = ({
  photoDialogOpen,
  setDialogVisibility
}) => (
  <Dialog
    open = {photoDialogOpen}
    className="photo-upload-dialog"
    onRequestClose={() => setDialogVisibility(false)}
    autoScrollBodyContent={true}
    title="Upload a Profile Photo"
  >
    <Dropzone onDrop={onDrop} />
  </Dialog>
);

export default ProfileImageUploader;
