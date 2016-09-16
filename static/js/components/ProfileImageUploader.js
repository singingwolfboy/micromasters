import React from 'react';
import Dialog from 'material-ui/Dialog';
import { connnect } from 'react-redux';
import R from 'ramda';
import Dropzone from 'react-dropzone';

const onDrop = files => console.log(files);

const dropZone = () => (
  <Dropzone
    onDrop = {onDrop}
    className = "photo-active-item photo-dropzone"
    activeClassName = "photo-active-item photo-dropzone active"
  >
    <div>
      Drag a photo here or click to select a photo.
    </div>
  </Dropzone>
);

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
    { dropZone() }
  </Dialog>
);

export default ProfileImageUploader;
