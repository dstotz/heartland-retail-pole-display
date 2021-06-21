// Proxy's request through Sinatra server to avoid cors. Can change base URL to
// `https://${subdomain}.retail.heartland.us` and remove the header X-Subdomain
// once cors has been set up.

interface SearchParam {
  name: string;
  value: string;
}

const baseUrl = process.env.REACT_APP_BASE_API_URL as string;

const requestUrl = (
  subdomain: string,
  endpoint: string,
  params?: SearchParam[]
): string => {
  const url = new URL(endpoint, baseUrl);
  if (params) {
    url.search = params
      .map((param) => `${param.name}=${param.value}`)
      .join('&');
  }
  return url.toString();
};

export const getLocationWithStation = async (
  subdomain: string,
  apiKey: string
): Promise<any[]> => {
  const url = requestUrl(subdomain, '/api/locations', [
    { name: '_include[]', value: 'stations' },
    { name: 'per_page', value: 'all' },
  ]);
  const response = await fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'X-Subdomain': subdomain,
    },
  });
  const json = await response.json();
  return json.results;
};

export const getCompanyName = async (
  subdomain: string,
  apiKey: string
): Promise<string> => {
  const url = requestUrl(subdomain, '/api/settings/company_name');
  const response = await fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'X-Subdomain': subdomain,
    },
  });
  const json = await response.json();
  return json.value;
};

export const getLogoUrl = async (
  subdomain: string,
  apiKey: string
): Promise<string> => {
  const url = requestUrl(subdomain, '/api/settings/company.logo_url');
  const response = await fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'X-Subdomain': subdomain,
    },
  });
  const json = await response.json();
  return json.value;
};

export const getTicketInfo = async (
  subdomain: string,
  apiKey: string,
  stationId: string
): Promise<any | null> => {
  const url = requestUrl(subdomain, '/api/sales/tickets', [
    { name: '_filter[]', value: `{"station_id":${stationId}}` },
    { name: '_include[]', value: 'lines' },
    { name: '_include[]', value: 'subtotal' },
    { name: '_include[]', value: 'tax_total' },
    { name: '_include[]', value: 'payments' },
    { name: 'sort', value: 'updated_at,desc' },
    { name: 'per_page', value: '1' },
  ]);
  const response = await fetch(url, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'X-Subdomain': subdomain,
    },
  });

  const json = await response.json();
  const ticket = json.results[0];

  if (ticket && ticket.status === 'incomplete') {
    return ticket;
  } else {
    return {};
  }
};
