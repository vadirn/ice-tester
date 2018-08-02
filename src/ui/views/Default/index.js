import React from 'react';
import Form from 'components/Form';
import RadioButton from 'components/Form/RadioButton';
import Button from 'components/Form/Button';
import TextField from 'components/Form/TextField';
import PropTypes from 'prop-types';
import withConsumer from 'with-consumer';
import Errors from 'components/Form/Errors';
import c from 'classnames';
import s from './styles.css';

class ServerListItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
  }
  handleRemoveClick() {
    this.props.onRemoveClick(this.props.server.key);
  }
  render() {
    const { server } = this.props;
    let urls = '';
    if (typeof server.urls === 'string') {
      urls = server.urls;
    } else {
      urls = server.urls.join(', ');
    }
    return (
      <div className="fs-s flex p-u m-s-t negative-m-u-r negative-m-u-l bg-neutral-2" key={server.key}>
        <div className="flex-auto m-s-r">
          <div className="bold truncate">{urls}</div>
          <div className="truncate">{server.username}</div>
          <div className="truncate">{server.credential}</div>
        </div>
        <div className="color-accent-1">
          <Button onClick={this.handleRemoveClick} type="button">
            Remove
          </Button>
        </div>
      </div>
    );
  }
}

ServerListItem.propTypes = {
  onRemoveClick: PropTypes.func,
  server: PropTypes.object,
};

class Default extends Form {
  constructor(props) {
    super(props);

    this.addServer = this.addServer.bind(this);
    this.removeServer = this.removeServer.bind(this);
    this.handleNewFieldKeyDown = this.handleNewFieldKeyDown.bind(this);
    this.state = {
      servers: [],
      IceTransports: 'all',
      'new[uri]': 'stun:stun.l.google.com:19302',
      'new[username]': '',
      'new[password]': '',
      'new[errors]': [],
    };
  }
  handleNewFieldKeyDown(evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault();
      this.addServer();
    }
  }
  addServer() {
    const uri = this.state['new[uri]'].trim();
    const username = this.state['new[username]'].trim();
    const password = this.state['new[password]'].trim();
    // Check if uri starts with stun:
    let urls = uri.split(', ').map(url => url.trim());
    const allValid = urls.reduce((accum, url) => {
      return accum && (url.startsWith('stun:') || url.startsWith('turn:'));
    }, true);

    if (allValid) {
      if (urls.length === 1) {
        urls = urls[0];
      }
      const server = { key: new Date().getTime().toString(), urls };
      if (username.length > 0 && password.length > 0) {
        server.username = username;
        server.credential = password;
      }
      this.setState(state => ({
        servers: [server, ...state.servers],
        'new[uri]': '',
        'new[username]': '',
        'new[password]': '',
        'new[errors]': [],
      }));
    } else {
      this.setState({ 'new[errors]': ['URL has to start with "stun:" or "turn:"'] });
    }
  }
  removeServer(key) {
    this.setState(state => ({
      servers: state.servers.filter(server => {
        return server.key !== key;
      }),
    }));
  }
  render() {
    return (
      <div className={c('p-m', s.container)}>
        <form className={c('p-m', s.form)}>
          <div className="m-m-b">
            <p className="m-s-b">
              <b>Step 1.</b> Add STUN/TURN servers to the list
            </p>
            <div className="bg-neutral-1 p-u negative-m-u-l negative-m-u-r">
              <div className="m-u-b fs-s">Add new server:</div>
              <div className="m-u-b">
                <label>
                  <span>STUN or TURN URI</span>
                  <TextField
                    name="new[uri]"
                    value={this.state['new[uri]']}
                    onKeyDown={this.handleNewFieldKeyDown}
                    onChange={this.handleChange}
                    autoComplete="off"
                    placeholder="stun:stun.l.google.com:19302"
                  />
                </label>
              </div>
              <div className="m-u-b">
                <label>
                  <span>Username (optional)</span>
                  <TextField
                    name="new[username]"
                    value={this.state['new[username]']}
                    onKeyDown={this.handleNewFieldKeyDown}
                    onChange={this.handleChange}
                    autoComplete="off"
                  />
                </label>
              </div>
              <div className="m-s-b">
                <label>
                  <span>Password (optional)</span>
                  <TextField
                    name="new[password]"
                    value={this.state['new[password]']}
                    onKeyDown={this.handleNewFieldKeyDown}
                    onChange={this.handleChange}
                    autoComplete="off"
                  />
                </label>
              </div>
              <Errors value={this.state['new[errors]']} />
              <Button type="button" onClick={this.addServer}>
                Add server
              </Button>
            </div>

            {this.state.servers.map(server => (
              <ServerListItem key={server.key} server={server} onRemoveClick={this.removeServer} />
            ))}
          </div>

          <div className="m-m-b">
            <p className="m-s-b">
              <b>Step 2.</b> Select &quot;all&quot; or &quot;relay&quot; for ICE Transport Policy setting
            </p>
            <RadioButton
              name="IceTransports"
              value="all"
              checked={this.state['IceTransports'] === 'all'}
              label="all"
              onChange={this.handleChange}
            />
            <RadioButton
              name="IceTransports"
              value="relay"
              checked={this.state['IceTransports'] === 'relay'}
              label="relay"
              onChange={this.handleChange}
            />
          </div>

          <div className="m-m-b">
            <p className="m-s-b">
              <b>Step 3.</b> Start ICE gathering. This will create a new peerconnection using provided configuration. It
              will ask for microphone access.
            </p>
          </div>

          <div className="m-m-b">
            <Button type="submit">Save configuration and start</Button>
          </div>

          <div className="m-m-b">
            <div className="m-s-b bold">Results</div>
            ...
          </div>
        </form>
      </div>
    );
  }
}

function filter() {
  return {
    defaultValues: {
      IceTransports: 'all',
      'new[uri]': '',
      'new[username]': '',
      'new[password]': '',
    },
    fieldErrors: {},
    errors: [],
  };
}

export default withConsumer(Default, filter);
