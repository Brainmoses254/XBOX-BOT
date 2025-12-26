const fs = require('fs');
const path = require('path');
const { MessageType, downloadContentFromMessage } = require('@adiwajshing/baileys'); // MessageType is deprecated in v5 but left for clarity

/**
 * handleMessage(conn, msg, settings)
 * - conn: Baileys socket instance (makeWASocket)
 * - msg: incoming message (proto)
 * - settings: instance of Setting (from Setting.js) or plain object with backgroundImage and songFile
 */
async function handleMessage(conn, msg, settings) {
  try {
    // some messages are system events; skip
    if (!msg.message || !msg.key) return;

    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    // extract text (works for extended messages)
    const messageContent = msg.message.conversation || msg.message.extendedTextMessage && msg.message.extendedTextMessage.text || '';
    const text = (messageContent || '').trim();

    // basic commands
    if (!text) return;

    const lower = text.toLowerCase();

    if (lower === '!help' || lower === 'help') {
      const helpText = [
        'WhatsApp Bot Commands:',
        '!help - show this message',
        '!background - receive the configured background image',
        '!song - receive the configured song (mp3)'
      ].join('\n');
      await conn.sendMessage(from, { text: helpText }, { quoted: msg });
      return;
    }

    if (lower === '!background') {
      const imgPath = settings.get ? settings.get('backgroundImage') : settings.backgroundImage;
      if (fs.existsSync(imgPath)) {
        const buffer = fs.readFileSync(imgPath);
        await conn.sendMessage(from, { image: buffer, caption: 'Background image' }, { quoted: msg });
      } else {
        await conn.sendMessage(from, { text: `Background not found. Expected at: ${imgPath}` }, { quoted: msg });
      }
      return;
    }

    if (lower === '!song') {
      const songPath = settings.get ? settings.get('songFile') : settings.songFile;
      if (fs.existsSync(songPath)) {
        const buffer = fs.readFileSync(songPath);
        // send as audio (not voice note)
        await conn.sendMessage(from, { audio: buffer, mimetype: 'audio/mpeg' }, { quoted: msg });
      } else {
        await conn.sendMessage(from, { text: `Song not found. Expected at: ${songPath}` }, { quoted: msg });
      }
      return;
    }

    // default: reply simple echo (optional)
    // await conn.sendMessage(from, { text: `You said: ${text}` }, { quoted: msg });
  } catch (err) {
    console.error('inbox handler error:', err);
    try {
      if (msg && msg.key && msg.key.remoteJid) {
        await conn.sendMessage(msg.key.remoteJid, { text: 'Sorry, an error occurred processing your request.' }, { quoted: msg });
      }
    } catch (_) {}
  }
}

module.exports = { handleMessage };