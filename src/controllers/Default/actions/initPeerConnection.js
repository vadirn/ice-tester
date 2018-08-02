// Source for parseCandidate and formatPriority:
// https://github.com/webrtc/samples/blob/gh-pages/src/content/peerconnection/trickle-ice/js/main.js

function parseCandidate(text) {
  const candidateStr = 'candidate:';
  const pos = text.indexOf(candidateStr) + candidateStr.length;
  var [foundation, component, protocol, priority, address, port, , type] = text.substr(pos).split(' ');
  return {
    component: component,
    type: type,
    foundation: foundation,
    protocol: protocol,
    address: address,
    port: port,
    priority: formatPriority(priority),
  };
}

// Parse the uint32 PRIORITY field into its constituent parts from RFC 5245,
// type preference, local preference, and (256 - component ID).
// ex: 126 | 32252 | 255 (126 is host preference, 255 is component ID 1)
function formatPriority(priority) {
  return [priority >> 24, (priority >> 8) & 0xffff, priority & 0xff].join(' | ');
}

export default function initPeerConnection({ controller, setState }, rtcConfiguration) {
  setState(state => {
    state.rtcConfiguration = rtcConfiguration;
    state.candidates = [];
    state.iceGatheringState = '';
    return state;
  });
  if (controller.pc) {
    controller.pc.close();
  }
  controller.actions.getUserMedia({ controller }).then(mediaStream => {
    controller.pc = new RTCPeerConnection(rtcConfiguration);

    const handleICEGatheringStateChange = function handleICEGatheringStateChange() {
      setState(state => {
        state.iceGatheringState = controller.pc.iceGatheringState;
        return state;
      });
      if (controller.pc.iceGatheringState === 'complete') {
        controller.actions.releaseMedia({ controller });
      }
    };
    const handleICECandidate = function handleICECandidate(evt) {
      console.log(evt.candidate.candidate);
      if (evt.candidate !== null) {
        const candidate = {
          ...parseCandidate(evt.candidate.candidate),
          mediaType: evt.candidate.sdpMid,
        };
        setState(state => {
          if (state.candidates) {
            state.candidates.push(candidate);
            return state;
          }
          state.candidates = [];
          return state;
        });
      }
    };

    controller.pc.addEventListener('icegatheringstatechange', handleICEGatheringStateChange);
    controller.pc.addEventListener('icecandidate', handleICECandidate);

    mediaStream.getTracks().forEach(track => {
      controller.pc.addTrack(track);
    });

    controller.pc.createOffer({ offerToReceiveAudio: 1, offerToReceiveVideo: 1 }).then(description => {
      controller.pc.setLocalDescription(description);
    });
  });
}
