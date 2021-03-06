import configureTestStore from 'redux-asserts';
import { assert } from 'chai';
import sinon from 'sinon';

import {
  FETCH_SUCCESS,
  FETCH_FAILURE,
} from '../actions';
import {
  SET_ENROLL_MESSAGE,
} from '../actions/ui';
import { PROGRAM_ENROLLMENTS } from '../constants';
import {
  addProgramEnrollment,
  fetchProgramEnrollments,
  receiveGetProgramEnrollmentsSuccess,
  clearEnrollments,
  setCurrentProgramEnrollment,

  REQUEST_GET_PROGRAM_ENROLLMENTS,
  RECEIVE_GET_PROGRAM_ENROLLMENTS_SUCCESS,
  RECEIVE_GET_PROGRAM_ENROLLMENTS_FAILURE,
  REQUEST_ADD_PROGRAM_ENROLLMENT,
  RECEIVE_ADD_PROGRAM_ENROLLMENT_SUCCESS,
  RECEIVE_ADD_PROGRAM_ENROLLMENT_FAILURE,
  CLEAR_ENROLLMENTS,
  SET_CURRENT_PROGRAM_ENROLLMENT,
} from '../actions/enrollments';
import * as api from '../util/api';
import rootReducer from '../reducers';

describe('enrollments', () => {
  let sandbox, store, getProgramEnrollmentsStub, addProgramEnrollmentStub;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    store = configureTestStore(rootReducer);
    getProgramEnrollmentsStub = sandbox.stub(api, 'getProgramEnrollments');
    addProgramEnrollmentStub = sandbox.stub(api, 'addProgramEnrollment');
  });

  afterEach(() => {
    sandbox.restore();
  });

  const newEnrollment = {
    id: 999,
    title: "New enrollment"
  };

  describe('enrollments reducer', () => {
    let dispatchThen;
    beforeEach(() => {
      dispatchThen = store.createDispatchThen(state => state.enrollments);
    });

    it('should have an empty default state', () => {
      return dispatchThen({type: 'unknown'}, ['unknown']).then(state => {
        assert.deepEqual(state, {
          programEnrollments: []
        });
      });
    });

    it('should fetch program enrollments successfully', () => {
      getProgramEnrollmentsStub.returns(Promise.resolve(PROGRAM_ENROLLMENTS));

      return dispatchThen(
        fetchProgramEnrollments(),
        [REQUEST_GET_PROGRAM_ENROLLMENTS, RECEIVE_GET_PROGRAM_ENROLLMENTS_SUCCESS]
      ).then(enrollmentsState => {
        assert.equal(enrollmentsState.getStatus, FETCH_SUCCESS);
        assert.deepEqual(enrollmentsState.programEnrollments, PROGRAM_ENROLLMENTS);
        assert.equal(getProgramEnrollmentsStub.callCount, 1);
        assert.deepEqual(getProgramEnrollmentsStub.args[0], []);
      });
    });

    it('should fail to fetch program enrollments', () => {
      getProgramEnrollmentsStub.returns(Promise.reject("error"));

      return dispatchThen(
        fetchProgramEnrollments(),
        [REQUEST_GET_PROGRAM_ENROLLMENTS, RECEIVE_GET_PROGRAM_ENROLLMENTS_FAILURE]
      ).then(enrollmentsState => {
        assert.equal(enrollmentsState.getStatus, FETCH_FAILURE);
        assert.equal(enrollmentsState.getErrorInfo, "error");
        assert.deepEqual(enrollmentsState.programEnrollments, []);
        assert.equal(getProgramEnrollmentsStub.callCount, 1);
        assert.deepEqual(getProgramEnrollmentsStub.args[0], []);
      });
    });

    it('should add a program enrollment successfully to the existing enrollments', () => {
      addProgramEnrollmentStub.returns(Promise.resolve(newEnrollment));
      store.dispatch(receiveGetProgramEnrollmentsSuccess(PROGRAM_ENROLLMENTS));

      return dispatchThen(addProgramEnrollment(newEnrollment.id), [
        REQUEST_ADD_PROGRAM_ENROLLMENT,
        RECEIVE_ADD_PROGRAM_ENROLLMENT_SUCCESS,
        SET_ENROLL_MESSAGE,
      ]).then(enrollmentsState => {
        assert.equal(enrollmentsState.postStatus, FETCH_SUCCESS);
        assert.deepEqual(enrollmentsState.programEnrollments, PROGRAM_ENROLLMENTS.concat(newEnrollment));
        assert.equal(addProgramEnrollmentStub.callCount, 1);
        assert.deepEqual(addProgramEnrollmentStub.args[0], [newEnrollment.id]);

        assert.equal(
          store.getState().ui.enrollMessage,
          `You are now enrolled in the ${newEnrollment.title} MicroMasters`
        );
      });
    });

    it('should fail to add a program enrollment and leave the existing state alone', () => {
      addProgramEnrollmentStub.returns(Promise.reject("addError"));
      store.dispatch(receiveGetProgramEnrollmentsSuccess(PROGRAM_ENROLLMENTS));

      return dispatchThen(addProgramEnrollment(newEnrollment.id), [
        REQUEST_ADD_PROGRAM_ENROLLMENT,
        RECEIVE_ADD_PROGRAM_ENROLLMENT_FAILURE,
        SET_ENROLL_MESSAGE,
      ]).then(enrollmentsState => {
        assert.equal(enrollmentsState.postStatus, FETCH_FAILURE);
        assert.equal(enrollmentsState.postErrorInfo, "addError");
        assert.deepEqual(enrollmentsState.programEnrollments, PROGRAM_ENROLLMENTS);
        assert.equal(addProgramEnrollmentStub.callCount, 1);
        assert.deepEqual(addProgramEnrollmentStub.args[0], [newEnrollment.id]);

        assert.equal(store.getState().ui.enrollMessage, "There was an error during enrollment");
      });
    });

    it('should clear the enrollments', () => {
      store.dispatch(receiveGetProgramEnrollmentsSuccess(PROGRAM_ENROLLMENTS));

      return dispatchThen(clearEnrollments(), [CLEAR_ENROLLMENTS]).then(enrollmentsState => {
        assert.deepEqual(enrollmentsState, {
          programEnrollments: []
        });
      });
    });
  });

  describe('currentProgramEnrollment reducer', () => {
    let dispatchThen;
    beforeEach(() => {
      dispatchThen = store.createDispatchThen(state => state.currentProgramEnrollment);
    });

    it('should have a null default state', () => {
      assert.equal(store.getState().currentProgramEnrollment, null);
    });

    it('should set the current enrollment', () => {
      return dispatchThen(setCurrentProgramEnrollment(PROGRAM_ENROLLMENTS[1]), [SET_CURRENT_PROGRAM_ENROLLMENT]).
        then(state => {
          assert.deepEqual(state, PROGRAM_ENROLLMENTS[1]);
        });
    });

    it("should pick the first enrollment if none is already set after receiving a list of enrollments", () => {
      store.dispatch(receiveGetProgramEnrollmentsSuccess(PROGRAM_ENROLLMENTS));
      assert.deepEqual(store.getState().currentProgramEnrollment, PROGRAM_ENROLLMENTS[0]);
    });

    it("should replace the current enrollment if it can't be found in the list of enrollments", () => {
      let enrollment = {"id": 999, "title": "not an enrollment anymore"};
      store.dispatch(setCurrentProgramEnrollment(enrollment));
      store.dispatch(receiveGetProgramEnrollmentsSuccess(PROGRAM_ENROLLMENTS));
      assert.deepEqual(store.getState().currentProgramEnrollment, PROGRAM_ENROLLMENTS[0]);
    });

    it("should clear the current enrollment if it can't be found in an empty list of enrollments", () => {
      let enrollment = {"id": 999, "title": "not an enrollment anymore"};
      store.dispatch(setCurrentProgramEnrollment(enrollment));
      store.dispatch(receiveGetProgramEnrollmentsSuccess([]));
      assert.deepEqual(store.getState().currentProgramEnrollment, null);
    });

    it("should not pick a current enrollment after receiving a list of enrollments if one is already picked", () => {
      store.dispatch(setCurrentProgramEnrollment(PROGRAM_ENROLLMENTS[1]));
      store.dispatch(receiveGetProgramEnrollmentsSuccess(PROGRAM_ENROLLMENTS));
      assert.deepEqual(store.getState().currentProgramEnrollment, PROGRAM_ENROLLMENTS[1]);
    });
  });
});
