import React from 'react';
import PropTypes from 'prop-types';
import c from 'classnames';
import s from './styles.css';
import withConsumer from 'with-consumer';

export function Link({ children, ...props }) {
  return (
    <a className={s.container} {...props}>
      <div className="relative inline-block">
        <div className={c('absolute top-0 left-0 right-0 bottom-0', s.backdrop)} />
        <div className="relative z1">{children}</div>
      </div>
    </a>
  );
}

Link.propTypes = {
  children: PropTypes.node,
};

function filter({ plugins }, props) {
  const { page, params, query } = props;
  const href = plugins.router.serializeLocationData(page, { params, query });
  return {
    href,
    onClick(evt) {
      evt.preventDefault();
      plugins.router.assignLocation(href);
    },
  };
}

export default withConsumer(Link, filter);
