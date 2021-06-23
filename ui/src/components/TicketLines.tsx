import React from 'react';
import { usdFormatter } from '../shared/formatter';
import { TicketLine } from '../types/TicketLine';

interface IProps {
  lines: TicketLine[];
}

export const TicketLines = (props: IProps) => {
  const lines = (props.lines || []).filter(
    (line: any) => line.type === 'ItemLine' || line.type === 'GiftCardLine'
  );

  if (lines.length < 1) return <div />;

  const lineRows = lines.map((line: any) => (
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
  ));

  return (
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
      <tbody>{lineRows}</tbody>
    </table>
  );
};