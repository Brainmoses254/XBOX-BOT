import React, { useState, useEffect } from 'react';

const defaultSettings = { theme: 'light', language: 'en', notifications: true };

export default function Setting({ initial = defaultSettings, onChange }) {
  const [settings, setSettings] = useState(initial);

  useEffect(() => {
    onChange && onChange(settings);
  }, [settings]);

  return (
    <div className="settings">
      <label>
        Theme
        <select value={settings.theme} onChange={e => setSettings({ ...settings, theme: e.target.value })}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>

      <label>
        Language
        <select value={settings.language} onChange={e => setSettings({ ...settings, language: e.target.value })}>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </label>

      <label>
        <input
          type="checkbox"
          checked={settings.notifications}
          onChange={e => setSettings({ ...settings, notifications: e.target.checked })}
        />
        Enable notifications
      </label>
    </div>
  );
}