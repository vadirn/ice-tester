import DefaultView from 'views/Default';

export default class Default {
  constructor(context, params) {
    this._component = params && params.component;
  }
  get View() {
    return DefaultView;
  }
  get actions() {
    return {};
  }
  dispose() {}
}
