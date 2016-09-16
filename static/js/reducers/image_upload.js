import {
  START_PHOTO_EDIT,
  CLEAR_PHOTO_EDIT,
  UPDATE_PHOTO_EDIT
} from '../actions/image_upload';

export const INITIAL_IMAGE_UPLOAD_STATE = {
  edit: false
};

export const imageUpload = (state = INITIAL_IMAGE_UPLOAD_STATE, action) => {
  switch (action.type) {
  case START_PHOTO_EDIT:
    return { ...state,
      edit: true,
      photo: action.payload,
      filename: action.payload.name,
    };
  case CLEAR_PHOTO_EDIT:
    return INITIAL_IMAGE_UPLOAD_STATE;
  case UPDATE_PHOTO_EDIT:
    return { ...state, photoEdit: action.payload };
  default:
    return state;
  }
};
