import React from 'react';
import Form from 'components/Form';
import RadioButton from 'components/Form/RadioButton';
import Button from 'components/Form/Button';
import TextField from 'components/Form/TextField';
import ServerListItem from './components/ServerListItem';
import Report from './components/Report';
import { Link } from 'components/Link';
import withConsumer from 'with-consumer';
import Errors from 'components/Form/Errors';
import c from 'classnames';
import s from './styles.css';

class Default extends Form {
  constructor(props) {
    super(props);

    this.addServer = this.addServer.bind(this);
    this.removeServer = this.removeServer.bind(this);
    this.handleNewFieldKeyDown = this.handleNewFieldKeyDown.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleStop = this.handleStop.bind(this);

    this.state = {
      servers: [],
      IceTransports: 'all',
      'new[uri]': 'stun:stun.l.google.com:19302',
      'new[username]': '',
      'new[password]': '',
      'new[errors]': [],
    };
  }
  handleSubmit(evt) {
    evt.preventDefault();
    // prepare RTCConfiguration parameters
    const rtcConfiguration = {
      servers: this.state.servers.map(_server => {
        const { key, ...server } = _server;
        return server;
      }),
      iceTransportPolicy: this.state.iceTransportPolicy,
    };
    if (rtcConfiguration.servers.length === 0) {
      Promise.resolve().then(() => {
        window.alert('Please add at least one server');
      });
    } else {
      this.props.initPeerConnection(rtcConfiguration);
    }
  }
  handleStop() {
    this.props.releaseMedia();
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
        <form onSubmit={this.handleSubmit} className={c('p-m', s.form)}>
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
              might also ask for microphone access.
            </p>
          </div>

          <div className="m-m-b">
            <span className="inline-block m-u-b">
              <Button type="submit">Save configuration and start</Button>
            </span>
            <span className="inline-block w-s" />
            <span className="inline-block color-accent-1">
              <Button type="button" onClick={this.handleStop}>
                STOP
              </Button>
            </span>
          </div>
          <Report />
          <div className="text-center fs-s">
            <Link rel="noopener noreferrer" href="https://github.com/vadirn/ice-tester" target="_blank">
              https://github.com/vadirn/ice-tester
            </Link>
          </div>
        </form>
      </div>
    );
  }
}

function filter({ controller, setState }) {
  return {
    defaultValues: {
      IceTransports: 'all',
      'new[uri]': '',
      'new[username]': '',
      'new[password]': '',
    },
    fieldErrors: {},
    errors: [],
    getUserMedia() {
      controller.actions.getUserMedia({ controller });
    },
    initPeerConnection(rtcConfiguration) {
      controller.actions.initPeerConnection({ controller, setState }, rtcConfiguration);
    },
    releaseMedia() {
      controller.actions.releaseMedia({ controller });
    },
  };
}

export default withConsumer(Default, filter);
