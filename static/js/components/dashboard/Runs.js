// @flow
import React from 'react';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import Button from 'react-mdl/lib/Button';

import RunRow from './RunRow';
import {
  STATUS_NOT_PASSED,
  STATUS_PASSED,
  STATUS_ENROLLED,
  STATUS_VERIFIED,
  STATUS_OFFERED,
} from '../../constants';
import type { Course, CourseRun } from '../../flow/programTypes';


export default class Runs extends React.Component {
  props: {
    course: Course;
  };

  render() {
    const { course } = this.props;

    let firstRun: CourseRun = {};
    if (course.runs.length > 0) {
      firstRun = course.runs[0];
    }

    let rows = [];

    if (firstRun.status === STATUS_NOT_PASSED && course.runs.length === 1) {
      // if there aren't any rows to show don't show anything, unless user failed the course
      // in which case we want to say that there are no courses to re-enroll in
      rows.push(
        <Grid className="run" key="no-future-runs">
          <Cell col={9} className="run-description">
            No future runs of this course are currently scheduled.
          </Cell>
          <Cell col={3} className="run-action">
            <Button className="dashboard-button" disabled={true}>
              Re-enroll
            </Button>
          </Cell>
        </Grid>
      );
    }
    if (firstRun.status === STATUS_ENROLLED) {
      // show the upgrade button
      rows.push(
        <Grid className="run" key="auditing">
          <Cell col={9} className="run-description">
            You are currently auditing this course. You need to upgrade
            to the verified course to get credit for the MicroMasters.
          </Cell>
          <Cell col={3} className="run-action">
            <Button className="dashboard-button" disabled={false}>
              Upgrade
            </Button>
          </Cell>
        </Grid>
      );
    }

    for (let run of course.runs.slice(1)) {
      if (run.status === STATUS_NOT_PASSED || run.status === STATUS_PASSED) {
        rows.push(<RunRow run={run} key={run.id} />);
      } else if (run.status === STATUS_OFFERED && firstRun.status === STATUS_NOT_PASSED) {
        // only show newly offered runs if user failed previous run
        rows.push(<RunRow run={run} key={run.id} />);
      }
      // not checking STATUS_ENROLLED or STATUS_VERIFIED since it would imply they are taking
      // two runs at the same time
    }

    return <div>
      {rows}
    </div>;
  }
}
