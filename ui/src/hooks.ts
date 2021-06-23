import { useState, useEffect } from 'react';
import { Config } from './types/Config';
import { getFeatureFlags, getTicketInfo } from './lib/heartlandRetailApi';
import { getV2TicketInfo } from './lib/heartlandRetailApiV2';

type ApiVersion = 'v1' | 'v2';

export const useApiVersion = (config: Config): ApiVersion => {
  const [apiVersion, setApiVersion] = useState<ApiVersion>('v1');

  const getApiVersion = async () => {
    let version: ApiVersion = 'v1';
    const featureFlags = await getFeatureFlags(
      config.subdomain,
      config.apiToken
    );

    if (featureFlags.api_v2) {
      const lastv1Ticket = await getTicketInfo(
        config.subdomain,
        config.apiToken,
        config.stationId
      );
      const lastv2Ticket = await getV2TicketInfo(
        config.subdomain,
        config.apiToken,
        config.stationUUID
      );

      if (
        lastv2Ticket &&
        (!lastv1Ticket ||
          Date.parse(lastv2Ticket.updated_at) >
            Date.parse(lastv1Ticket.updated_at))
      ) {
        version = 'v2';
      }
    }
    console.log('Seting API version to', version);
    setApiVersion(version);
  };

  useEffect(() => {
    if (config.subdomain && config.subdomain && config.stationId) {
      getApiVersion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  return apiVersion;
};
