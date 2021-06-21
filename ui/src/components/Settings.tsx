import React, { useEffect, useState } from 'react';
import { getLocationWithStation } from '../lib/heartlandRetailApi';
import { getCurrentConfig } from '../shared/defaultConfig';

interface IProps {
  onSave?: (config: any) => void;
}

export const Settings = (props: IProps) => {
  const poleConfigKey = 'hr_pole_config';
  const defaultConfig = getCurrentConfig();

  const [locationsWithStations, setLocationsWithStations] = useState<any[]>([]);
  const [stationListLoading, setStationListLoading] = useState(false);
  const [tokenIsValid, setTokenIsValid] = useState(true);
  const [subdomain, setSubdomain] = useState(defaultConfig.subdomain);
  const [apiToken, setApiToken] = useState(defaultConfig.apiToken);
  const [stationId, setStationId] = useState(defaultConfig.stationId);
  const [showLogo, setShowLogo] = useState(defaultConfig.showLogo === true);

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

  const handleStationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStationId(e.currentTarget.value);
  };

  const handleShowLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowLogo(e.currentTarget.checked);
  };

  const handleSave = () => {
    const config = { subdomain, apiToken, stationId, showLogo };
    localStorage.setItem(poleConfigKey, JSON.stringify(config));
    if (props.onSave) {
      props.onSave(config);
    }
  };

  const handleReset = () => {
    setSubdomain('');
    setApiToken('');
    setStationId('none');
    setShowLogo(false);
    localStorage.setItem(poleConfigKey, '{}');
  };

  const stationDropdownItems = (): JSX.Element[] => {
    if (!locationsWithStations) return [];
    const dropdownItems: JSX.Element[] = [];
    locationsWithStations.forEach((location) => {
      const stations = location.stations as any[];
      stations.forEach((station) => {
        dropdownItems.push(
          <option key={station.id} value={station.id}>
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
            value={subdomain}
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
            value={apiToken}
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
              value={locationsWithStations && stationId}
            >
              <option value="none">Select Station</option>
              {stationDropdownItems()}
            </select>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="checkbox">
          <input
            type="checkbox"
            onChange={handleShowLogoChange}
            checked={showLogo}
          />
          Show logo on display?
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
