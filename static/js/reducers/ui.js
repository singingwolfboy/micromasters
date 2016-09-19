// @flow
/* global SETTINGS: false */
import {
  CLEAR_UI,
  UPDATE_DIALOG_TEXT,
  UPDATE_DIALOG_TITLE,
  SET_DIALOG_VISIBILITY,

  SET_WORK_HISTORY_EDIT,
  SET_WORK_DIALOG_VISIBILITY,
  SET_WORK_DIALOG_INDEX,
  SET_WORK_HISTORY_ANSWER,

  SET_EDUCATION_DIALOG_VISIBILITY,
  SET_EDUCATION_DIALOG_INDEX,
  SET_EDUCATION_DEGREE_LEVEL,
  SET_EDUCATION_LEVEL_ANSWERS,

  SET_USER_PAGE_DIALOG_VISIBILITY,

  SET_SHOW_EDUCATION_DELETE_DIALOG,
  SET_SHOW_WORK_DELETE_DIALOG,
  SET_DELETION_INDEX,

  SET_PROFILE_STEP,
  SET_USER_MENU_OPEN,
  SET_SEARCH_FILTER_VISIBILITY,

  SET_EMAIL_DIALOG_VISIBILITY,

  SET_ENROLL_DIALOG_ERROR,
  SET_ENROLL_DIALOG_VISIBILITY,
  SET_ENROLL_MESSAGE,
  SET_ENROLL_SELECTED_PROGRAM,

  SET_PHOTO_DIALOG_VISIBILITY,
} from '../actions/ui';
import { PERSONAL_STEP } from '../constants';
import type { Action } from '../flow/reduxTypes';

export type UIDialog = {
  title?: string;
  text?: string;
  visible?: boolean;
};
export type UIState = {
  educationDialogVisibility:    boolean;
  educationDialogIndex:         number;
  educationDegreeLevel:         string;
  educationLevelAnswers:        {};
  workHistoryEdit:              boolean;
  workDialogVisibility:         boolean;
  workHistoryAnswer:            ?boolean;
  userPageDialogVisibility:     boolean;
  showWorkDeleteDialog:         boolean;
  showEducationDeleteDialog:    boolean;
  deletionIndex:                ?number;
  dialog:                       UIDialog;
  profileStep:                  string;
  workDialogIndex:              ?number;
  userMenuOpen:                 boolean;
  searchFilterVisibility:       {[s: string]: boolean};
  tosDialogVisibility:          boolean;
  emailDialogVisibility:        boolean;
  enrollDialogError:            ?string;
  enrollDialogVisibility:       boolean;
  enrollMessage:                ?string;
  enrollSelectedProgram:        ?number;
  photoDialogVisibility:        boolean;
};

export const INITIAL_UI_STATE: UIState = {
  educationDialogVisibility:  false,
  educationDialogIndex:       -1,
  educationDegreeLevel:       '',
  educationLevelAnswers:      {},
  workHistoryEdit:            true,
  workDialogVisibility:       false,
  workHistoryAnswer:          null,
  userPageDialogVisibility: false,
  showWorkDeleteDialog: false,
  showEducationDeleteDialog: false,
  deletionIndex: null,
  dialog: {},
  profileStep: PERSONAL_STEP,
  workDialogIndex:  null,
  userMenuOpen: false,
  searchFilterVisibility: {},
  tosDialogVisibility: false,
  emailDialogVisibility: false,
  enrollDialogError: null,
  enrollDialogVisibility: false,
  enrollMessage: null,
  enrollSelectedProgram: null,
  photoDialogVisibility: false,
};

export const ui = (state: UIState = INITIAL_UI_STATE, action: Action) => {
  switch (action.type) {
  case UPDATE_DIALOG_TEXT:
    return Object.assign({}, state, {
      dialog: Object.assign(
        {},
        state.dialog,
        { text: action.payload }
      )
    });
  case UPDATE_DIALOG_TITLE:
    return Object.assign({}, state, {
      dialog: Object.assign(
        {},
        state.dialog,
        { title: action.payload }
      )
    });
  case SET_DIALOG_VISIBILITY:
    return Object.assign({}, state, {
      dialog: Object.assign(
        {},
        state.dialog,
        { visible: action.payload }
      )
    });
  case SET_WORK_HISTORY_EDIT:
    return Object.assign({}, state, {
      workHistoryEdit: action.payload
    });
  case SET_WORK_DIALOG_VISIBILITY:
    return Object.assign({}, state, {
      workDialogVisibility: action.payload
    });
  case SET_WORK_DIALOG_INDEX:
    return Object.assign({}, state, {
      workDialogIndex: action.payload
    });
  case SET_WORK_HISTORY_ANSWER:
    return Object.assign({}, state, {
      workHistoryAnswer: action.payload
    });
  case SET_EDUCATION_DIALOG_VISIBILITY:
    return Object.assign({}, state, {
      educationDialogVisibility: action.payload
    });
  case SET_EDUCATION_DIALOG_INDEX:
    return Object.assign({}, state, {
      educationDialogIndex: action.payload
    });
  case SET_EDUCATION_DEGREE_LEVEL:
    return Object.assign({}, state, {
      educationDegreeLevel: action.payload
    });
  case SET_EDUCATION_LEVEL_ANSWERS:
    return Object.assign({}, state, {
      educationLevelAnswers: action.payload
    });
  case CLEAR_UI:
    return INITIAL_UI_STATE;
  case SET_USER_PAGE_DIALOG_VISIBILITY: {
    return Object.assign({}, state, {
      userPageDialogVisibility: action.payload
    });
  }
  case SET_SHOW_EDUCATION_DELETE_DIALOG: {
    return Object.assign({}, state, {
      showEducationDeleteDialog: action.payload
    });
  }
  case SET_SHOW_WORK_DELETE_DIALOG: {
    return Object.assign({}, state, {
      showWorkDeleteDialog: action.payload
    });
  }
  case SET_DELETION_INDEX: {
    return Object.assign({}, state, {
      deletionIndex: action.payload
    });
  }
  case SET_PROFILE_STEP: {
    return Object.assign({}, state, {
      profileStep: action.payload
    });
  }
  case SET_USER_MENU_OPEN: {
    return Object.assign({}, state, {
      userMenuOpen: action.payload
    });
  }
  case SET_SEARCH_FILTER_VISIBILITY: {
    return Object.assign({}, state, {
      searchFilterVisibility: action.payload
    });
  }
  case SET_EMAIL_DIALOG_VISIBILITY: {
    return Object.assign({}, state, {
      emailDialogVisibility: action.payload
    });
  }
  case SET_ENROLL_DIALOG_ERROR: {
    return Object.assign({}, state, {
      enrollDialogError: action.payload
    });
  }
  case SET_ENROLL_MESSAGE: {
    return Object.assign({}, state, {
      enrollMessage: action.payload
    });
  }
  case SET_ENROLL_SELECTED_PROGRAM: {
    return Object.assign({}, state, {
      enrollSelectedProgram: action.payload
    });
  }
  case SET_ENROLL_DIALOG_VISIBILITY: {
    return Object.assign({}, state, {
      enrollDialogVisibility: action.payload
    });
  }
  case SET_PHOTO_DIALOG_VISIBILITY:
    return { ...state, photoDialogVisibility: action.payload };
  default:
    return state;
  }
};
