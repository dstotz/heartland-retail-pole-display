import { Config } from '../types/Config';

export const defaultConfig: Config = {
  subdomain: null,
  apiToken: null,
  stationId: null,
  stationUUID: null,
  showLogo: false,
  pollingFrequency: 1_000,
  ticketTimeout: 90_000,
  useTicketTimeout: false,
  splashScreenUrl: null,
};

export const getCurrentConfig = (): Config => {
  const poleConfigKey = 'hr_pole_config';
  const configString = localStorage.getItem(poleConfigKey);
  if (configString) {
    const existingConfig = JSON.parse(configString);
    return { ...defaultConfig, ...existingConfig };
  } else {
    return defaultConfig;
  }
};
