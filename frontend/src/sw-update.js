import { registerSW } from 'virtual:pwa-register';

registerSW({
  onNeedRefresh() {
    // auto reload when new version is available
    window.location.reload();
  },
  onOfflineReady() {},
});
