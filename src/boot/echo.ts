import { boot } from 'quasar/wrappers';
import Echo from 'laravel-echo';
import io from 'socket.io-client';

declare global {
  interface Window {
    Echo: InstanceType<typeof Echo>;
    io: typeof io;
  }
}

export default boot(({ app }) => {
  // Attach socket.io to window
  window.io = io;

  window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: 'http://localhost:6001', // Ensure this is reachable from the browser
    transports: ['websocket', 'polling']
  });

  console.log('Laravel Echo booted:', window.Echo);

  // Make Echo available globally (optional)
  app.config.globalProperties.$echo = window.Echo;
});
