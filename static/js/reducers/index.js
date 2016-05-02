/* global SETTINGS: false */
import { combineReducers } from 'redux';
import {
  REQUEST_COURSE_LIST,
  RECEIVE_COURSE_LIST_SUCCESS,
  RECEIVE_COURSE_LIST_FAILURE,
  CLEAR_COURSE_LIST,

  REQUEST_GET_USER_PROFILE,
  RECEIVE_GET_USER_PROFILE_SUCCESS,
  RECEIVE_GET_USER_PROFILE_FAILURE,
  CLEAR_PROFILE,
  UPDATE_PROFILE,
  START_PROFILE_EDIT,
  CLEAR_PROFILE_EDIT,
  REQUEST_PATCH_USER_PROFILE,
  RECEIVE_PATCH_USER_PROFILE_SUCCESS,
  RECEIVE_PATCH_USER_PROFILE_FAILURE,
  UPDATE_PROFILE_VALIDATION,

  SHOW_EDUCATION_FORM_DIALOG,
  HIDE_EDUCATION_FORM_DIALOG,
  TOGGLE_EDUCATION_LEVEL,
  DISABLE_EDUCATION_LEVEL,

  REQUEST_DASHBOARD,
  RECEIVE_DASHBOARD_SUCCESS,
  RECEIVE_DASHBOARD_FAILURE,
  CLEAR_DASHBOARD,

  FETCH_FAILURE,
  FETCH_PROCESSING,
  FETCH_SUCCESS,
} from '../actions';

const INITIAL_COURSE_LIST_STATE = {
  courseList: [],
  programList: []
};

export const courseList = (state = INITIAL_COURSE_LIST_STATE, action) => {
  switch (action.type) {
  case REQUEST_COURSE_LIST:
    return Object.assign({}, state, {
      fetchStatus: FETCH_PROCESSING
    });
  case RECEIVE_COURSE_LIST_SUCCESS:
    return Object.assign({}, state, {
      fetchStatus: FETCH_SUCCESS,
      courseList: action.payload.courseList,
      programList: action.payload.programList
    });
  case RECEIVE_COURSE_LIST_FAILURE:
    return Object.assign({}, state, {
      fetchStatus: FETCH_FAILURE
    });
  case CLEAR_COURSE_LIST:
    return INITIAL_COURSE_LIST_STATE;
  default:
    return state;
  }
};

export const INITIAL_DIALOG_STATE = {
  openDialog: false,
  degreeLevel: '',
  educationIndex: 0
};
export const educationDialog = (state = INITIAL_DIALOG_STATE, action) => {
  switch (action.type) {
    case SHOW_EDUCATION_FORM_DIALOG:
      return Object.assign({}, state, {
        openDialog: true,
        degreeLevel: action.payload.level,
        educationIndex: action.payload.index
      });
    case HIDE_EDUCATION_FORM_DIALOG:
      return INITIAL_DIALOG_STATE;
    default:
      return state;
  }
};
export const INITIAL_EDUCATION_LEVEL_STATE = {
  hs: true,
  a: true,
  b: true,
  m: false,
  d: false
};
export const educationLevels = (state = INITIAL_EDUCATION_LEVEL_STATE, action) => {
  switch (action.type) {
    case TOGGLE_EDUCATION_LEVEL:
      let updated_state = {};
      updated_state[action.payload.level]= !state[action.payload.level];
      return Object.assign({}, state, updated_state);

    default:
      return state;
  }
};


export const INITIAL_USER_PROFILE_STATE = {
  profile: {}
};

export const userProfile = (state = INITIAL_USER_PROFILE_STATE, action) => {
  switch (action.type) {
  case REQUEST_GET_USER_PROFILE:
    return Object.assign({}, state, {
      getStatus: FETCH_PROCESSING
    });
  case RECEIVE_GET_USER_PROFILE_SUCCESS:
    return Object.assign({}, state, {
      getStatus: FETCH_SUCCESS,
      profile: action.payload.profile
    });
  case RECEIVE_GET_USER_PROFILE_FAILURE:
    return Object.assign({}, state, {
      getStatus: FETCH_FAILURE
    });
  case CLEAR_PROFILE:
    return INITIAL_USER_PROFILE_STATE;
  case UPDATE_PROFILE:
    if (state.edit === undefined) {
      // caller must have dispatched START_PROFILE_EDIT successfully first
      return state;
    }
    return Object.assign({}, state, {
      edit: Object.assign({}, state.edit, {
        profile: action.payload.profile
      })
    });
  case START_PROFILE_EDIT:
    if (state.getStatus !== FETCH_SUCCESS) {
      // ignore attempts to edit if we don't have a valid profile to edit yet
      return state;
    }
    return Object.assign({}, state, {
      edit: {
        profile: state.profile,
        errors: {}
      }
    });
  case CLEAR_PROFILE_EDIT:
    return Object.assign({}, state, {
      edit: undefined
    });
  case REQUEST_PATCH_USER_PROFILE:
    return Object.assign({}, state, {
      patchStatus: FETCH_PROCESSING
    });
  case RECEIVE_PATCH_USER_PROFILE_SUCCESS:
    return Object.assign({}, state, {
      patchStatus: FETCH_SUCCESS,
      profile: action.payload.profile
    });
  case RECEIVE_PATCH_USER_PROFILE_FAILURE:
    return Object.assign({}, state, {
      patchStatus: FETCH_FAILURE
    });
  case UPDATE_PROFILE_VALIDATION:
    if (state.edit === undefined) {
      // caller must have dispatched START_PROFILE_EDIT successfully first
      return state;
    }
    return Object.assign({}, state, {
      edit: Object.assign({}, state.edit, {
        errors: action.payload.errors
      })
    });
  default:
    return state;
  }
};

const INITIAL_DASHBOARD_STATE = {
  programs: []
};

export const dashboard = (state = INITIAL_DASHBOARD_STATE, action) => {
  switch (action.type) {
  case REQUEST_DASHBOARD:
    return Object.assign({}, state, {
      fetchStatus: FETCH_PROCESSING
    });
  case RECEIVE_DASHBOARD_SUCCESS:
    return Object.assign({}, state, {
      fetchStatus: FETCH_SUCCESS,
      programs: action.payload.programs
    });
  case RECEIVE_DASHBOARD_FAILURE:
    return Object.assign({}, state, {
      fetchStatus: FETCH_FAILURE
    });
  case CLEAR_DASHBOARD:
    return INITIAL_DASHBOARD_STATE;
  default:
    return state;
  }
};


export default combineReducers({
  courseList,
  userProfile,
  dashboard,
  educationDialog,
  educationLevels
});
