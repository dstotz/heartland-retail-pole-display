import React, { useState } from 'react';
import { Settings } from './Settings';
import { SettingLock } from './SettingLock';
import { Display } from './Display';
import { getCurrentConfig } from '../shared/defaultConfig';
import { Config } from '../types/Config';

export const Main = () => {
  const [config, setConfig] = useState<Config>(getCurrentConfig());

  const setupComplete = (vals: any): boolean => {
    const isSetupComplete =
      vals.subdomain && vals.apiToken && vals.stationId && true;
    return isSetupComplete === true;
  };

  const [settingsOpen, setSettingsOpen] = useState(!setupComplete(config));

  const handleSave = (vals: any) => {
    setConfig(vals);
    if (setupComplete(vals)) {
      setSettingsOpen(false);
    }
  };

  return (
    <div>
      <SettingLock onUnlocked={() => setSettingsOpen(true)} />
      <div className={`modal ${settingsOpen && 'is-active'}`}>
        <div className="modal-background"></div>
        <div className="modal-card">
          <header className="modal-card-head">
            <p className="modal-card-title">Settings</p>
            <button
              className="delete"
              aria-label="close"
              onClick={() => {
                setSettingsOpen(false);
              }}
            ></button>
          </header>
          <section className="modal-card-body" style={{ zIndex: 2000 }}>
            <Settings onSave={handleSave} />
          </section>
        </div>
      </div>

      <div className="container has-text-centered">
        <div
          id="notifications"
          style={{ position: 'absolute', top: 10, right: 25 }}
        ></div>
        <section id="main" className="section">
          {!settingsOpen && <Display config={config} />}
        </section>
      </div>

      <div
        className="hr-logo"
        style={{ position: 'fixed', bottom: -5, right: -5 }}
      >
        <img
          src="/HRLogo.png"
          alt="Heartland Retail"
          style={{ height: '45px' }}
        />
      </div>
    </div>
  );
};
