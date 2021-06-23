import React from 'react';
import { Config } from '../types/Config';
import { Ticket } from '../types/Ticket';

interface IProps {
  ticket: Ticket;
  config: Config;
}

export const TicketHeader = (props: IProps) => {
  return (
    <nav className="level">
      {props.config.showTicketNumber && (
        <div className="level-item has-text-centered">
          <div className="container">
            <p className="heading">Ticket #</p>
            <p className="title">{props.ticket.public_id}</p>
          </div>
        </div>
      )}
      {props.config.showCustomer && props.ticket.customer_name && (
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Customer</p>
            <p className="title">{props.ticket.customer_name}</p>
          </div>
        </div>
      )}
    </nav>
  );
};
