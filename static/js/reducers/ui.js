import {
  CLEAR_UI,
  UPDATE_DIALOG_TEXT,
  UPDATE_DIALOG_TITLE,
  SET_DIALOG_VISIBILITY,

  SET_WORK_HISTORY_EDIT,
  SET_WORK_DIALOG_VISIBILITY,
  SET_WORK_DIALOG_INDEX,

  TOGGLE_DASHBOARD_EXPANDER,

  SET_EDUCATION_DIALOG_VISIBILITY,
  SET_EDUCATION_DIALOG_INDEX,
  SET_EDUCATION_DEGREE_LEVEL,
  SET_EDUCATION_DEGREE_INCLUSIONS,
} from '../actions/ui';
import { HIGH_SCHOOL, ASSOCIATE, BACHELORS, MASTERS, DOCTORATE } from '../constants';

export const INITIAL_UI_STATE = {
  workHistoryEdit:            true,
  workDialogVisibility:       false,
  dashboardExpander:          {},
  educationDialogVisibility:  false,
  educationDialogIndex:       null,
  educationDegreeLevel:       '',
  educationDegreeInclusions:  {
    [HIGH_SCHOOL]: true,
    [ASSOCIATE]: true,
    [BACHELORS]: true,
    [MASTERS]: false,
    [DOCTORATE]: false,
  },
};

export const ui = (state = INITIAL_UI_STATE, action) => {
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
  case SET_EDUCATION_DEGREE_INCLUSIONS:
    return Object.assign({}, state, {
      educationDegreeInclusions: action.payload
    });
  case CLEAR_UI:
    return INITIAL_UI_STATE;
  case TOGGLE_DASHBOARD_EXPANDER: {
    let clone = Object.assign({}, state.dashboardExpander);
    clone[action.payload.courseId] = action.payload.newValue;
    return Object.assign({}, state, {
      dashboardExpander: clone
    });
  }
  default:
    return state;
  }
};