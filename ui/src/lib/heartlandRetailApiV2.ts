import { GraphQLClient, gql } from 'graphql-request';
import { Ticket } from '../types/Ticket';
import { TicketLine } from '../types/TicketLine';
import { TicketPayment } from '../types/TicketPayment';

const getTicketQuery = gql`
  query salesOrder($stationId: ID) {
    salesOrders(first: 1, stationId: $stationId) {
      nodes {
        id
        createdAt
        updatedAt
        status
        orderNumber
        subtotal
        total
        totalTax
        amountPaid
        amountDue
        customer {
          name
        }
        change
        deposits {
          id
          paymentType {
            description
            name
          }
          amount
        }
        refunds {
          id
          paymentType {
            description
            name
          }
          amount
        }
        paymentStatus
        orderRequests {
          ... on OrderRequestInStore {
            id
            status
            orderRequestNumber
            taxes {
              description
              amount
            }
            giftCardLines {
              nodes {
                id
                qty
                giftCard {
                  number
                }
                description
                amount
              }
            }
            itemLines {
              nodes {
                id
                description
                item {
                  itemNumber
                }
                qty
                unitPrice
                finalUnitPrice
                totalAtUnitPrice
              }
            }
          }
          ... on OrderRequestShipment {
            id
            status
            orderRequestNumber
            taxes {
              description
              amount
            }
            giftCardLines {
              nodes {
                id
                qty
                giftCard {
                  number
                }
                description
                amount
              }
            }
            itemLines {
              nodes {
                id
                description
                item {
                  itemNumber
                }
                qty
                unitPrice
                finalUnitPrice
                totalAtUnitPrice
              }
            }
          }
        }
      }
    }
  }
`;

export const getV2TicketInfo = async (
  subdomain: string,
  apiKey: string,
  stationUUID: string
): Promise<Ticket | null> => {
  if (!stationUUID) return null;
  const baseUrl = process.env.REACT_APP_BASE_API_URL as string;
  const url = new URL('/api/graphql', baseUrl);
  const graphQLClient = new GraphQLClient(url.toString(), {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Subdomain': subdomain,
    },
  });

  try {
    const data = await graphQLClient.request(getTicketQuery, {
      stationId: stationUUID,
    });
    const order = data.salesOrders.nodes[0];

    let orderLines: TicketLine[] = [];
    order.orderRequests.forEach((request: any) => {
      request.itemLines.nodes.forEach((line: any) => {
        orderLines.push({
          id: line.id,
          description: line.description,
          created_at: line.createdAt,
          updated_at: line.updatedAt,
          item_public_id: line.item.itemNumber,
          qty: line.qty,
          adjusted_unit_price: line.finalUnitPrice,
          unit_price: line.unitPrice,
          type: 'ItemLine',
          value: line.totalAtUnitPrice,
        });
      });

      request.giftCardLines.nodes.forEach((line: any) => {
        orderLines.push({
          id: line.id,
          description: line.description,
          created_at: line.createdAt,
          updated_at: line.updatedAt,
          qty: line.qty,
          adjusted_unit_price: line.amount,
          unit_price: line.amount,
          type: 'GiftCardLine',
          value: line.amount,
        });
      });
    });
    orderLines = orderLines.sort((a, b) =>
      a.updated_at > b.updated_at ? 1 : -1
    );

    let orderPayments: TicketPayment[] = [];
    order.deposits.forEach((payment: any) => {
      orderPayments.push({
        id: payment.id,
        description: payment.paymentType.name,
        created_at: payment.createdAt,
        updated_at: payment.updatedAt,
        amount: payment.amount,
      });
    });
    order.refunds.forEach((payment: any) => {
      orderPayments.push({
        id: payment.id,
        description: payment.paymentType.name,
        created_at: payment.createdAt,
        updated_at: payment.updatedAt,
        amount: payment.amount,
      });
    });
    orderPayments = orderPayments.sort((a, b) =>
      a.updated_at > b.updated_at ? 1 : -1
    );

    const ticketStatus = order.status === 'DRAFT' ? 'incomplete' : order.status;

    const ticket: Ticket = {
      id: order.id,
      status: ticketStatus,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
      public_id: order.orderNumber,
      customer_name: order.customer?.name,
      subtotal: order.subtotal,
      balance: order.amountDue,
      tax_total: order.totalTax,
      total: order.total,
      total_paid: order.amountPaid,
      lines: orderLines,
      payments: orderPayments,
    };

    return ticket;
  } catch (err) {
    console.error('Failed to get v2 ticket', err);
    return null;
  }
};
