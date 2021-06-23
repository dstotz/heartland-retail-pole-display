import React, { useEffect, useState } from 'react';
import { getLocationWithStation } from '../lib/heartlandRetailApi';
import { defaultConfig, getCurrentConfig } from '../shared/defaultConfig';
import { Config } from '../types/Config';

interface IProps {
  onSave?: (config: Config) => void;
}

export const Settings = (props: IProps) => {
  const poleConfigKey = 'hr_pole_config';
  const [locationsWithStations, setLocationsWithStations] = useState<any[]>([]);
  const [stationListLoading, setStationListLoading] = useState(false);
  const [tokenIsValid, setTokenIsValid] = useState(true);
  const currentConfig = getCurrentConfig();

  // Required
  const [subdomain, setSubdomain] = useState(currentConfig.subdomain);
  const [apiToken, setApiToken] = useState(currentConfig.apiToken);
  const [stationId, setStationId] = useState(currentConfig.stationId);
  const [stationUUID, setStationUUID] = useState(currentConfig.stationUUID);

  // Options
  const [showLogo, setShowLogo] = useState(currentConfig.showLogo === true);
  const [pollingFrequency, setPollingFrequency] = useState(
    currentConfig.pollingFrequency
  );
  const [ticketTimeout, setTicketTimeout] = useState(
    currentConfig.ticketTimeout
  );
  const [useTicketTimeout, setUseTicketTimeout] = useState(
    currentConfig.useTicketTimeout
  );
  const [splashScreenUrl, setSplashScreenUrl] = useState(
    currentConfig.splashScreenUrl
  );

  useEffect(() => {
    if (apiToken && subdomain && tokenIsValid) {
      setStationListLoading(true);
      getLocationWithStation(subdomain, apiToken).then((locations) => {
        setLocationsWithStations(locations);
        setStationListLoading(false);
      });
    }
  }, [subdomain, apiToken, tokenIsValid]);

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubdomain(e.currentTarget.value);
  };

  const handleApiTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tokenVal = e.currentTarget.value;
    setApiToken(tokenVal);
    if (tokenVal.length > 100) {
      setTokenIsValid(true);
    } else {
      setTokenIsValid(false);
    }
  };

  const handleStationChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const stationId = e.currentTarget.value;
    const uuid = e.currentTarget.selectedOptions[0].dataset.uuid;
    setStationId(stationId);
    setStationUUID(uuid);
  };

  const handleShowLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowLogo(e.currentTarget.checked);
  };

  const handleUseTicketTimeoutChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUseTicketTimeout(e.currentTarget.checked);
  };

  const handleSave = () => {
    const newConfig: Config = {
      subdomain,
      apiToken,
      stationId,
      stationUUID,
      showLogo,
      pollingFrequency,
      ticketTimeout,
      useTicketTimeout,
      splashScreenUrl,
    };
    localStorage.setItem(poleConfigKey, JSON.stringify(newConfig));
    if (props.onSave) {
      props.onSave(newConfig);
    }
  };

  const handleReset = () => {
    setSubdomain(defaultConfig.subdomain);
    setApiToken(defaultConfig.apiToken);
    setStationId(defaultConfig.stationId);
    setStationUUID(defaultConfig.stationUUID);
    setShowLogo(defaultConfig.showLogo);
    setPollingFrequency(defaultConfig.pollingFrequency);
    setTicketTimeout(defaultConfig.ticketTimeout);
    setUseTicketTimeout(defaultConfig.useTicketTimeout);
    setSplashScreenUrl(defaultConfig.splashScreenUrl);
    localStorage.setItem(poleConfigKey, JSON.stringify(defaultConfig));
  };

  const handlePollingFrequencyChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPollingFrequency(Number(e.currentTarget.value));
  };

  const handleTicketTimeoutChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTicketTimeout(Number(e.currentTarget.value));
  };

  const handleSplashScreenUrlChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSplashScreenUrl(e.currentTarget.value);
  };

  const stationDropdownItems = (): JSX.Element[] => {
    if (!locationsWithStations) return [];
    const dropdownItems: JSX.Element[] = [];
    locationsWithStations.forEach((location) => {
      const stations = location.stations as any[];
      stations.forEach((station) => {
        dropdownItems.push(
          <option key={station.id} value={station.id} data-uuid={station.uuid}>
            {location.name}: {station.name}
          </option>
        );
      });
    });
    return dropdownItems;
  };

  return (
    <div>
      <div className="field">
        <label className="label">Subdomain</label>
        <div className="control">
          <input
            value={subdomain || ''}
            className="input"
            type="text"
            placeholder="Subdomain"
            onChange={handleSubdomainChange}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">API Token</label>
        <div className="control">
          <input
            value={apiToken || ''}
            className={`input ${tokenIsValid ? null : 'is-danger'}`}
            type="text"
            placeholder="API Token"
            onChange={handleApiTokenChange}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Station</label>
        <div className="control is-expanded">
          <div
            className={`select is-fullwidth ${
              stationListLoading ? 'is-loading' : null
            }`}
          >
            <select
              disabled={stationListLoading}
              onChange={handleStationChange}
              value={locationsWithStations && stationId ? stationId : 'none'}
            >
              <option value="none">Select Station</option>
              {stationDropdownItems()}
            </select>
          </div>
        </div>
      </div>

      <hr />
      <h4 className="title is-4">Options</h4>

      <div className="field">
        <label className="label">Polling Frequency</label>
        <div className="control is-expanded">
          <div className="select is-fullwidth">
            <select
              onChange={handlePollingFrequencyChange}
              value={pollingFrequency}
            >
              <option value={1_000}>1 Sec</option>
              <option value={2_000}>2 Sec</option>
              <option value={3_000}>3 Sec</option>
              <option value={5_000}>5 Sec</option>
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="label">Splash screen URL</label>
        <div className="control">
          <input
            value={splashScreenUrl || ''}
            className="input"
            type="url"
            placeholder="https://example.com"
            pattern="https://.*"
            onChange={handleSplashScreenUrlChange}
          />
        </div>
      </div>

      {useTicketTimeout && (
        <div className="field">
          <label className="label">Idle Ticket Timeout</label>
          <div className="control is-expanded">
            <div className="select is-fullwidth">
              <select
                onChange={handleTicketTimeoutChange}
                value={ticketTimeout}
              >
                <option value={30_000}>30 Seconds</option>
                <option value={60_000}>60 Seconds</option>
                <option value={90_000}>90 Seconds</option>
                <option value={120_000}>2 Minutes</option>
                <option value={300_000}>5 Minutes</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="field">
        <label className="checkbox">
          <input
            type="checkbox"
            onChange={handleUseTicketTimeoutChange}
            checked={useTicketTimeout}
          />
          Hide idle tickets? (POS v1 only)
        </label>
      </div>

      <div className="field">
        <label className="checkbox">
          <input
            type="checkbox"
            onChange={handleShowLogoChange}
            checked={showLogo}
          />
          Show company logo on display?
        </label>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button className="button is-link" onClick={handleSave}>
            Save
          </button>
        </div>
        <div className="control">
          <button className="button is-link is-danger" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
