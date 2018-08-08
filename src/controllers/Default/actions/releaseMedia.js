export default function releaseMedia({ controller, setState }) {
  if (controller.useMedia) {
    controller.useMedia.then(mediaStream => {
      mediaStream.getTracks().forEach(track => {
        track.stop();
      });
    });
  }
  if (controller.pc) {
    controller.pc.close();
  }
  controller.useMedia = undefined;
  setState(state => {
    state.iceGatheringState = 'stopped';
    return state;
  });
}
