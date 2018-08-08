export default function({ setState }) {
  fetch('https://api.ipify.org')
    .then(response => response.text())
    .then(publicIP => {
      console.log(`public ip address: ${publicIP}`);
      setState(state => {
        state.publicIP = publicIP;
        return state;
      });
    });
}
