import DefaultView from 'views/Default';

import getUserMedia from './actions/getUserMedia';
import initPeerConnection from './actions/initPeerConnection';
import releaseMedia from './actions/releaseMedia';

export default class Default {
  constructor(context, params) {
    this._component = params && params.component;
    this._actions = {
      getUserMedia,
      initPeerConnection,
      releaseMedia,
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
