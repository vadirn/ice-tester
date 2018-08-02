export default function getUserMedia({ controller }) {
  if (controller.useMedia) {
    return controller.useMedia;
  } else {
    controller.useMedia = window.navigator.mediaDevices.getUserMedia({ audio: true }).then(mediaStream => {
      // extend audio with canvas video
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.rect(0, 0, 640, 480);
      ctx.fillStyle = 'black';
      ctx.fill();
      const canvasStream = canvas.captureStream(25);
      mediaStream.addTrack(canvasStream.getVideoTracks()[0]);
      return mediaStream;
    });

    return controller.useMedia;
  }
}
