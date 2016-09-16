// @flow
import {
  startPhotoEdit,
  START_PHOTO_EDIT,

  clearPhotoEdit,
  CLEAR_PHOTO_EDIT,

  updatePhotoEdit,
  UPDATE_PHOTO_EDIT,
} from './image_upload';
import { assertCreatedActionHelper } from './util';

describe('generated image upload action helpers', () => {
  it('should create all action creators', () => {
    [
      [startPhotoEdit, START_PHOTO_EDIT],
      [clearPhotoEdit, CLEAR_PHOTO_EDIT],
      [updatePhotoEdit, UPDATE_PHOTO_EDIT],
    ].forEach(assertCreatedActionHelper);
  });
});
