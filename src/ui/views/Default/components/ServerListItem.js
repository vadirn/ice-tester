import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Form/Button';

export default class ServerListItem extends React.Component {
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
