import React from 'react';
import withConsumer from 'with-consumer';
import PropTypes from 'prop-types';
import c from 'classnames';
import s from './styles.css';

function Report({ rtcConfiguration, iceGatheringState, publicIP, candidates: _candidates }) {
  // if (!rtcConfiguration) {
  //   return null;
  // }
  let candidates = [];
  if (_candidates) {
    candidates = _candidates;
  }

  return (
    <div className={c('p-u negative-m-u-l negative-m-u-r fs-s m-l-b', s.container)}>
      <div className="m-u-b">
        Public IP: <b>{publicIP}</b>
      </div>
      <div className="m-u-b">
        ICE Gathering State: <b>{iceGatheringState}</b>
      </div>
      <div className="m-u-b">
        RTC Configuration:
        <div className={s.configuration}>
          <pre className="ff-mono">
            <code>{JSON.stringify(rtcConfiguration, null, '  ')}</code>
          </pre>
        </div>
      </div>
      <div>
        <b>Candidates:</b>
        {candidates.map((candidate, idx) => {
          return (
            <div key={idx}>
              [{candidate.mediaType}, {candidate.type}] {candidate.address} (port {candidate.port})
            </div>
          );
        })}
      </div>
    </div>
  );
}

Report.propTypes = {
  rtcConfiguration: PropTypes.object,
  iceGatheringState: PropTypes.string,
  publicIP: PropTypes.string,
  candidates: PropTypes.array,
};

function filter({ data }) {
  return {
    publicIP: data.publicIP,
    rtcConfiguration: data.rtcConfiguration,
    iceGatheringState: data.iceGatheringState,
    candidates: data.candidates,
  };
}

export default withConsumer(Report, filter);
