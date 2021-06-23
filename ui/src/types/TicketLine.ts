export interface TicketLine {
  id: number;
  item_public_id?: string;
  type: string;
  description: string;
  created_at: string;
  updated_at: string;
  qty: number;
  unit_price: number;
  adjusted_unit_price: number;
  value: number;
}
