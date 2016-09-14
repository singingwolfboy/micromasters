// @flow
import React from 'react';
import Grid, { Cell } from 'react-mdl/lib/Grid';
import _ from 'lodash';

import {
  STATUS_NOT_PASSED,
  STATUS_PASSED,
  STATUS_ENROLLED,
  STATUS_VERIFIED,
  STATUS_OFFERED,
} from '../../constants';
import type { CourseRun } from '../../flow/programTypes';
import { asPercent, formatPrice } from '../../util/util';

export default class RunRow extends React.Component {
  props: {
    run: CourseRun;
  };

  render() {
    const { run } = this.props;
    let status, action;
    switch (run.status) {
    case STATUS_PASSED:
      status = 'Passed';
      action = asPercent(run.grade);
      break;
    case STATUS_NOT_PASSED:
      status = 'Failed';
      action = asPercent(run.grade);
      break;
    case STATUS_OFFERED: {
      // show price for upgrade
      let price;
      if (!_.isNil(run.price)) {
        price = formatPrice(run.price);
      }
      status = <div>
        <div className="price">
          {price}
        </div>
      </div>;
      action = asPercent(run.grade);
      break;
    }
    default:
      // should hopefully not happen, it would mean user is enrolled in a course but it's not showing up
      // as the first one in the list
      return '';
    }

    return <Grid className="run">
      <Cell col={6} className="run-description">
        {run.title}
      </Cell>
      <Cell col={3} className="run-status">
        {status}
      </Cell>
      <Cell col={3} className="run-action">
        {action}
      </Cell>
    </Grid>;
  }
}
