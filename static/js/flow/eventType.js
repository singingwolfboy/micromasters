// @flow

export type Event = {
  preventDefault: Function;
  target:         EventTarget;
};

export type EventTarget = {
  getAttribute: Function;
};