export const getCurrentConfig = (): any => {
  const poleConfigKey = 'hr_pole_config';
  const configString = localStorage.getItem(poleConfigKey) || '{}';
  return JSON.parse(configString);
};
