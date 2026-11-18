import { createApp } from './app.js';

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST || '127.0.0.1';

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT must be a whole number between 1 and 65535.');
  process.exit(1);
}

const server = createApp().listen(port, host, () => {
  console.log(`Listening on http://${host}:${port}`);
});
server.on('error', error => {
  console.error(`Server startup failed: ${error.message}`);
  process.exitCode = 1;
});
