import React from 'react';
import { usdFormatter } from '../shared/formatter';
import { Config } from '../types/Config';
import { TicketPayment } from '../types/TicketPayment';

interface IProps {
  payments: TicketPayment[];
  config: Config;
}

export const TicketPayments = (props: IProps) => {
  const payments = (props.payments || [])
    .filter((payment: any) => payment.status !== 'voided')
    .reverse();

  if (payments.length < 1) return <div />;

  const paymentBoxes: JSX.Element[] = payments.map((payment: any) => {
    let paymentDisplayName = payment.description;
    if (paymentDisplayName === 'Unresolved Credit Card Payment') {
      paymentDisplayName = 'Credit Card';
    }

    return (
      <div key={payment.id} className="tile is-parent">
        <article className="tile is-child notification is-primary">
          <p className="title">{usdFormatter.format(payment.amount)}</p>
          <p className="subtitle">{paymentDisplayName}</p>
        </article>
      </div>
    );
  });

  return (
    <div>
      <div className="tile is-ancestor" style={{ marginBottom: '4em' }}>
        <div className="tile is-vertical">
          <div className="tile">{paymentBoxes}</div>
        </div>
      </div>
    </div>
  );
};
