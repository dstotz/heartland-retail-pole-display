export interface Config {
  subdomain: string;
  apiToken: string;
  stationId: string;
  stationUUID: string;
  showLogo: boolean;
  useTicketTimeout: boolean;
  ticketTimeout: number;
  pollingFrequency: number;
  splashScreenUrl: string;
}
