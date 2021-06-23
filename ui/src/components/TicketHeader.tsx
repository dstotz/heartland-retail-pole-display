import React from 'react';
import { Ticket } from '../types/Ticket';

interface IProps {
  ticket: Ticket;
}

export const TicketHeader = (props: IProps) => {
  return (
    <nav className="level">
      <div className="level-item has-text-centered">
        <div className="container">
          <p className="heading">Ticket #</p>
          <p className="title">{props.ticket.public_id}</p>
        </div>
      </div>
      {props.ticket.customer_name && (
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
