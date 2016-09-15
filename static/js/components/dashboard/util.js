// @flow
import ReactTooltip from 'react-tooltip';
import IconButton from 'react-mdl/lib/IconButton';
import React from 'react';

export const courseListToolTip = (text: string, id: string) => (
  <div>
    <span className="tooltip-link"
      data-tip
      data-for={ id }>
      <IconButton name="help" className="help"/>
    </span>
    <ReactTooltip id={ id } effect="solid"
      event="click" globalEventOff="click" className="tooltip">
      { text }
    </ReactTooltip>
  </div>
);
