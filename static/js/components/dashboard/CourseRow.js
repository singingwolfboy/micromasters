// @flow
import React from 'react';
import Grid, { Cell } from 'react-mdl/lib/Grid';

import CourseAction from './CourseAction';
import CourseStatus from './CourseStatus';
import CourseDescription from './CourseDescription';
import type { Course } from '../../flow/programTypes';

export default class CourseRow extends React.Component {
  props: {
    checkout: Function,
    course: Course,
    now: moment$Moment,
  };

  render() {
    const { course, now, checkout } = this.props;

    return <Grid className="course-row">
      <Cell col={6}>
        <CourseDescription course={course} />
      </Cell>
      <Cell col={3}>
        <CourseStatus course={course}/>
      </Cell>
      <Cell col={3}>
        <CourseAction course={course} now={now} checkout={checkout} />
      </Cell>
    </Grid>;
  }
}
