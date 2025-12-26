const fs = require('fs');
const path = require('path');

const DEFAULTS = {
  backgroundImage: path.resolve(__dirname, 'assets', 'background.jpg'),
  songFile: path.resolve(__dirname, 'assets', 'song.mp3'),
  owner: '' // optional owner phone number in international format e.g. "1234567890@s.whatsapp.net"
};

class Setting {
  constructor(filepath) {
    this.filepath = filepath || path.resolve(process.cwd(), 'settings.json');
    this.data = { ...DEFAULTS };
    this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.filepath)) {
        const raw = fs.readFileSync(this.filepath, 'utf8');
        const parsed = JSON.parse(raw);
        this.data = { ...DEFAULTS, ...parsed };
      } else {
        this._save();
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
  }

  _save() {
    try {
      fs.writeFileSync(this.filepath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  get(key) {
    return key ? this.data[key] : { ...this.data };
  }

  set(key, value) {
    this.data[key] = value;
    this._save();
  }

  reset() {
    this.data = { ...DEFAULTS };
    this._save();
  }
}

module.exports = Setting;