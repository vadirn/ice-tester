import DefaultView from 'views/Default';

import getUserMedia from './actions/getUserMedia';
import initPeerConnection from './actions/initPeerConnection';
import releaseMedia from './actions/releaseMedia';
import fetchIP from './actions/fetchIP';

export default class Default {
  constructor(context, params) {
    this._component = params && params.component;
    this._actions = {
      getUserMedia,
      initPeerConnection,
      releaseMedia,
      fetchIP,
    };
  }
  get View() {
    return DefaultView;
  }
  get actions() {
    return this._actions;
  }
  dispose() {}
}
