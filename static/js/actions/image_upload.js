// @flow
import { createAction } from 'redux-actions';

export const START_PHOTO_EDIT = 'START_PHOTO_EDIT';
export const startPhotoEdit = createAction(START_PHOTO_EDIT);

export const CLEAR_PHOTO_EDIT = 'CLEAR_PHOTO_EDIT';
export const clearPhotoEdit = createAction(CLEAR_PHOTO_EDIT);

export const UPDATE_PHOTO_EDIT = 'UPDATE_PHOTO_EDIT';
export const updatePhotoEdit = createAction(UPDATE_PHOTO_EDIT);
