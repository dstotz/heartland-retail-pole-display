import { TicketLine } from './TicketLine';
import { TicketPayment } from './TicketPayment';

export interface Ticket {
  id: number;
  status: string; // Status could be any v1 or v2 status except "DRAFT" v2 status is converted to v1 "incomplete"
  created_at: string;
  updated_at: string;
  public_id: string;
  customer_name: string;
  lines: TicketLine[];
  payments: TicketPayment[];
  total: number;
  tax_total: number;
  subtotal: number;
  total_paid: number;
  balance: number;
}
