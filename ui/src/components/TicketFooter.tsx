import React from 'react';
import { usdFormatter } from '../shared/formatter';
import { Ticket } from '../types/Ticket';

interface IProps {
  ticket: Ticket;
}

export const TicketFooter = (props: IProps) => {
  return (
    <nav className="level">
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Tax Total</p>
          <p className="title">{usdFormatter.format(props.ticket.tax_total)}</p>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Item Subtotal</p>
          <p className="title">{usdFormatter.format(props.ticket.subtotal)}</p>
        </div>
      </div>
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Total</p>
          <p className="title">{usdFormatter.format(props.ticket.total)}</p>
        </div>
      </div>
      {props.ticket.total_paid !== 0 && (
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Total Paid</p>
            <p className="title">
              {usdFormatter.format(props.ticket.total_paid)}
            </p>
          </div>
        </div>
      )}
      {props.ticket.balance < 0 && (
        <div className="level-item has-text-centered">
          <div>
            <p className="heading">Change Due</p>
            <p className="title">
              {usdFormatter.format(props.ticket.balance * -1)}
            </p>
          </div>
        </div>
      )}
    </nav>
  );
};
