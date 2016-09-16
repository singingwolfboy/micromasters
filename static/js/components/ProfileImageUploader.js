import React from 'react';
import Dialog from 'material-ui/Dialog';
import { connnect } from 'react-redux';
import R from 'ramda';
import Dropzone from 'react-dropzone';
import Cropper from 'react-cropper';

const onDrop = R.curry((startPhotoEdit, files) => startPhotoEdit(...files));

const dropZone = onDrop => (
  <Dropzone
    onDrop={onDrop}
    className="photo-active-item photo-dropzone"
    activeClassName="photo-active-item photo-dropzone active"
  >
    <div>
      Drag a photo here or click to select a photo.
    </div>
  </Dropzone>
);

const b64ToFile = (str, name) => {
  const blob = atob(str.split(',')[1]);
  return new File([blob], 'asdf')
};


const cropHelper = updatePhotoEdit => () => {
  let updatedPhoto = this.refs.cropper.getCroppedCanvas().toDataURL();
  updatePhotoEdit(updatedPhoto);
};

const toDataURL = photo => (
  photo.is


const cropper = (crop, photo) => (
  <Cropper
    ref='cropper'
    className="photo-active-item cropper"
    src={photo.getAsDataURL()}
    aspectRatio={ 4 / 3 }
    guides={false}
    cropend={crop.bind(this)}
  />;
);

const ProfileImageUploader = ({
  photoDialogOpen,
  setDialogVisibility,
  startPhotoEdit,
  clearPhotoEdit,
  updatePhotoEdit,
  imageUpload: { edit, photo }
}) => {
  <Dialog
    open = {photoDialogOpen}
    className="photo-upload-dialog"
    onRequestClose={() => setDialogVisibility(false)}
    autoScrollBodyContent={true}
    title="Upload a Profile Photo"
  >
    { photo ? <CropperWrapper photo={photo} /> : dropZone(onDrop(startPhotoEdit)) }
  </Dialog>
};

export default ProfileImageUploader;
