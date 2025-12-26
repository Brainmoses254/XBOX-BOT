const fs = require('fs');
const path = require('path');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const { default: makeWASocket, useSingleFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@adiwajshing/baileys');

const Setting = require('./Setting');
const { handleMessage } = require('./inbox');

const logger = pino({ level: 'info' });
const SESSION_FILE = process.env.SESSION_FILE || path.resolve(process.cwd(), 'auth_info.json');

(async () => {
  // load settings
  const settings = new Setting();

  // Baileys auth state
  const { state, saveState } = useSingleFileAuthState(SESSION_FILE);

  // fetch version
  let version = [2, 2204, 13];
  try {
    const got = await fetchLatestBaileysVersion();
    version = got.version;
    logger.info({ version }, 'Baileys version');
  } catch (e) {
    logger.warn('Could not fetch latest version, using fallback');
  }

  const sock = makeWASocket({
    logger,
    printQRInTerminal: false,
    auth: state,
    version
  });

  // print QR to terminal on first auth
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log('Scan the QR above with your WhatsApp mobile app.');
    }
    if (connection === 'close') {
      const reason = (lastDisconnect && lastDisconnect.error && lastDisconnect.error.output) ? lastDisconnect.error.output.statusCode : lastDisconnect?.error?.message;
      logger.warn('connection closed', { reason });
      // try to reconnect on non-logout
      if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        // reconnect by creating a new socket (simple approach)
        setTimeout(() => {
          process.exit(1); // let process manager restart if any
        }, 2000);
      } else {
        console.log('Logged out. Delete auth_info.json and restart to re-authenticate.');
      }
    } else if (connection === 'open') {
      logger.info('Connected to WhatsApp');
    }
  });

  // save auth state on changes
  sock.ev.on('creds.update', saveState);

  // listen for messages
  sock.ev.on('messages.upsert', async (m) => {
    try {
      const messages = m.messages;
      for (const msg of messages) {
        // ignore status broadcasts
        if (msg.key && msg.key.remoteJid && msg.key.remoteJid.endsWith('@status')) continue;
        // ignore messages from self if you want
        if (msg.key.fromMe) continue;
        await handleMessage(sock, msg, settings);
      }
    } catch (err) {
      console.error('messages.upsert handler error:', err);
    }
  });

  // graceful shutdown
  process.on('SIGINT', async () => {
    logger.info('Shutting down...');
    try {
      await sock.logout();
    } catch (e) {}
    process.exit(0);
  });
})();