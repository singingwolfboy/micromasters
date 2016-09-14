// @flow
import React from 'react';
import { shallow } from 'enzyme';
import { assert } from 'chai';
import _ from 'lodash';

import Runs from './Runs';
import { findCourse } from './CourseDescription_test';
import {
  STATUS_NOT_PASSED,
} from '../../constants';

describe('Runs', () => {
  it('renders runs after the first run for a not-passed course when there is at least one extra run', () => {
    let course = findCourse(course => (
      course.runs.length >= 2 &&
      course.runs[0].status === STATUS_NOT_PASSED
    ));

    let wrapper = shallow(<Runs course={course}/>);
    assert.equal(wrapper.find(".run").length, course.runs.length - 1);
  });

  it('renders a message saying there are no runs if a user failed a course and there are no more runs', () => {
    let course = findCourse(course => (
      course.runs.length > 0 &&
      course.runs[0].status === STATUS_NOT_PASSED
    ));
    course = Object.assign({}, course, {
      runs: [course.runs[0]]
    });

    let wrapper = shallow(<Runs course={course}/>);
    assert.equal(wrapper.find(".run").length, 1);
    assert.equal(
      wrapper.find(".run-description").children().text(),
      "No future runs of this course are currently scheduled."
    );
  });


});
