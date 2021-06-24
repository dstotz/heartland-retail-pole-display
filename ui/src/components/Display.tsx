import React, { useEffect, useState } from 'react';
import { useApiVersion } from '../hooks';
import {
  getTicketInfo,
  getLogoUrl,
  getCompanyName,
} from '../lib/heartlandRetailApi';
import { getV2TicketInfo } from '../lib/heartlandRetailApiV2';
import { Config } from '../types/Config';
import { Ticket } from '../types/Ticket';
import { SplashScreen } from './SplashScreen';
import { TicketHeader } from './TicketHeader';
import { TicketLines } from './TicketLines';
import { TicketPayments } from './TicketPayments';
import { TicketFooter } from './TicketFooter';

interface IProps {
  config: Config;
}

export const Display = (props: IProps) => {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>();
  const [companyName, setCompanyName] = useState<string>();
  const apiVersion = useApiVersion(props.config);

  const apiToken = props.config.apiToken;
  const stationId = props.config.stationId;
  const stationUUID = props.config.stationUUID;
  const subdomain = props.config.subdomain;
  const showLogo = props.config.showLogo;

  const endOfPageRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    if (subdomain && apiToken) {
      getCompanyName(subdomain, apiToken).then((name) => setCompanyName(name));
      if (showLogo) {
        getLogoUrl(subdomain, apiToken).then((url) => setLogoUrl(url));
      }
    }
  }, [subdomain, apiToken, showLogo]);

  useEffect(() => {
    let interval = setInterval(async () => {
      if (apiToken && subdomain && stationId) {
        if (apiVersion === 'v2' && stationUUID) {
          const ticket = await getV2TicketInfo(
            subdomain,
            apiToken,
            stationUUID
          );
          setTicket(ticket);
        } else {
          const ticketInfo = await getTicketInfo(
            subdomain,
            apiToken,
            stationId
          );
          if (JSON.stringify(ticketInfo) !== JSON.stringify(ticket)) {
            setTicket(ticketInfo);
          }
        }
      }
    }, props.config.pollingFrequency);
    return () => {
      clearInterval(interval);
    };
  }, [
    subdomain,
    apiToken,
    stationId,
    stationUUID,
    apiVersion,
    ticket,
    props.config.pollingFrequency,
  ]);

  useEffect(() => {
    if (props.config.autoScroll && endOfPageRef.current) {
      endOfPageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticket, endOfPageRef, props.config.autoScroll]);

  const ticketIsIdle = (): boolean => {
    if (apiVersion === 'v2') return false;
    if (props.config.useTicketTimeout && ticket) {
      const currentTime = new Date().getTime();
      const ticketUpdateAt = Date.parse(ticket.updated_at);
      const diff = currentTime - ticketUpdateAt;
      return diff > props.config.ticketTimeout;
    } else {
      return false;
    }
  };

  let mainLine = <h1 className="title">{companyName}</h1>;
  if (showLogo) {
    mainLine = <img src={logoUrl} style={{ maxHeight: '150px' }} alt="" />;
  }

  if (!ticket || ticket.status !== 'incomplete' || ticketIsIdle()) {
    return (
      <div>
        {mainLine}
        <hr />
        <h1 className="title">
          Thank you for shopping {showLogo ? `at ${companyName}` : 'with us'}
        </h1>
        {props.config.splashScreenUrl && <SplashScreen config={props.config} />}
      </div>
    );
  }

  return (
    <div>
      {mainLine}
      <hr />
      <TicketHeader config={props.config} ticket={ticket} />
      <TicketLines config={props.config} lines={ticket.lines} />
      <TicketPayments config={props.config} payments={ticket.payments} />
      <TicketFooter config={props.config} ticket={ticket} />
      <div ref={endOfPageRef} />
    </div>
  );
};
