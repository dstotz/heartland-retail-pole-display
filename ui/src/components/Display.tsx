import React, { useEffect, useState } from 'react';
import { useApiVersion } from '../hooks';
import {
  getTicketInfo,
  getLogoUrl,
  getCompanyName,
} from '../lib/heartlandRetailApi';
import { getV2TicketInfo } from '../lib/heartlandRetailApiV2';
import { usdFormatter } from '../shared/formatter';
import { Config } from '../types/Config';
import { Ticket } from '../types/Ticket';
import { SplashScreen } from './SplashScreen';

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
          const ticket = await getTicketInfo(subdomain, apiToken, stationId);
          setTicket(ticket);
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
    props.config.pollingFrequency,
  ]);

  const ticketIsIdle = (): boolean => {
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

  const itemLines = (ticket.lines || []).filter(
    (line: any) => line.type === 'ItemLine' || line.type === 'GiftCardLine'
  );

  const payments = (ticket.payments || [])
    .filter((payment: any) => payment.status !== 'voided')
    .reverse();

  return (
    <div>
      {mainLine}
      <hr />

      <nav className="level">
        <div className="level-item has-text-centered">
          <div className="container">
            <p className="heading">Ticket #</p>
            <p className="title">{ticket.public_id}</p>
          </div>
        </div>
        {ticket.customer_name && (
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Customer</p>
              <p className="title">{ticket.customer_name}</p>
            </div>
          </div>
        )}
      </nav>

      {itemLines.length > 0 && (
        <table
          id="lines"
          className="table center table is-fullwidth table is-striped"
        >
          <thead>
            <tr>
              <th>Item #</th>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {itemLines.map((line: any) => (
              <tr key={line.id}>
                <td>{line.item_public_id}</td>
                <td>{line.description}</td>
                <td>{line.qty}</td>
                <td>
                  {usdFormatter.format(
                    line.adjusted_unit_price || line.unit_price || line.value
                  )}
                </td>
                <td>{usdFormatter.format(line.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {payments.length > 0 && (
        <div>
          <div className="tile is-ancestor" style={{ marginBottom: '4em' }}>
            <div className="tile is-vertical">
              <div className="tile">
                {payments.map((payment: any) => (
                  <div key={payment.id} className="tile is-parent">
                    <article className="tile is-child notification is-primary">
                      <p className="title">
                        {usdFormatter.format(payment.amount)}
                      </p>
                      <p className="subtitle">{payment.description}</p>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="level">
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Tax Total</p>
            <p className="title">{usdFormatter.format(ticket.tax_total)}</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Item Subtotal</p>
            <p className="title">{usdFormatter.format(ticket.subtotal)}</p>
          </div>
        </div>
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Total</p>
            <p className="title">{usdFormatter.format(ticket.total)}</p>
          </div>
        </div>
        {ticket.total_paid !== 0 && (
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Total Paid</p>
              <p className="title">{usdFormatter.format(ticket.total_paid)}</p>
            </div>
          </div>
        )}
        {ticket.balance < 0 && (
          <div className="level-item has-text-centered">
            <div>
              <p className="heading">Change Due</p>
              <p className="title">
                {usdFormatter.format(ticket.balance * -1)}
              </p>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};
