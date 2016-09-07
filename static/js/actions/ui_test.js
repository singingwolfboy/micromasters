import {
  CLEAR_UI,
  UPDATE_DIALOG_TEXT,
  UPDATE_DIALOG_TITLE,
  SET_DIALOG_VISIBILITY,
  SET_WORK_DIALOG_VISIBILITY,
  SET_WORK_DIALOG_INDEX,
  SET_EDUCATION_DIALOG_VISIBILITY,
  SET_EDUCATION_DIALOG_INDEX,
  SET_EDUCATION_DEGREE_LEVEL,
  SET_USER_PAGE_DIALOG_VISIBILITY,
  SET_SHOW_EDUCATION_DELETE_DIALOG,
  SET_SHOW_WORK_DELETE_DIALOG,
  SET_DELETION_INDEX,
  SET_SHOW_WORK_DELETE_ALL_DIALOG,
  SET_SHOW_EDUCATION_DELETE_ALL_DIALOG,
  SET_PROFILE_STEP,
  SET_USER_MENU_OPEN,
  SET_SEARCH_FILTER_VISIBILITY,
  SET_EMAIL_DIALOG_VISIBILITY,

  clearUI,
  updateDialogText,
  updateDialogTitle,
  setDialogVisibility,
  setWorkDialogVisibility,
  setWorkDialogIndex,
  setEducationDialogVisibility,
  setEducationDialogIndex,
  setEducationDegreeLevel,
  setUserPageDialogVisibility,
  setShowEducationDeleteDialog,
  setShowWorkDeleteDialog,
  setDeletionIndex,
  setShowWorkDeleteAllDialog,
  setShowEducationDeleteAllDialog,
  setProfileStep,
  setUserMenuOpen,
  setSearchFilterVisibility,
  setEmailDialogVisibility,
} from '../actions/ui';
import { assertCreatedActionHelper } from './util';

describe('generated UI action helpers', () => {
  it('should create all action creators', () => {
    [
      [clearUI, CLEAR_UI],
      [updateDialogText, UPDATE_DIALOG_TEXT],
      [updateDialogTitle, UPDATE_DIALOG_TITLE],
      [setDialogVisibility, SET_DIALOG_VISIBILITY],
      [setWorkDialogVisibility, SET_WORK_DIALOG_VISIBILITY],
      [setWorkDialogIndex, SET_WORK_DIALOG_INDEX],
      [setEducationDialogVisibility, SET_EDUCATION_DIALOG_VISIBILITY],
      [setEducationDialogIndex, SET_EDUCATION_DIALOG_INDEX],
      [setEducationDegreeLevel, SET_EDUCATION_DEGREE_LEVEL],
      [setUserPageDialogVisibility, SET_USER_PAGE_DIALOG_VISIBILITY],
      [setShowEducationDeleteDialog, SET_SHOW_EDUCATION_DELETE_DIALOG],
      [setShowWorkDeleteDialog, SET_SHOW_WORK_DELETE_DIALOG],
      [setDeletionIndex, SET_DELETION_INDEX],
      [setShowWorkDeleteAllDialog, SET_SHOW_WORK_DELETE_ALL_DIALOG],
      [setShowEducationDeleteAllDialog, SET_SHOW_EDUCATION_DELETE_ALL_DIALOG],
      [setProfileStep, SET_PROFILE_STEP],
      [setUserMenuOpen, SET_USER_MENU_OPEN],
      [setSearchFilterVisibility, SET_SEARCH_FILTER_VISIBILITY],
      [setEmailDialogVisibility, SET_EMAIL_DIALOG_VISIBILITY]
    ].forEach(assertCreatedActionHelper);
  });
});