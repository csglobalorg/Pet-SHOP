import { config } from '../config';

export interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ReceiptData {
  orderId: string;
  orderSource: string;
  cashierName?: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: string;
  subtotal: number;
  deliveryCharge: number;
  discountAmount: number;
  totalAmount: number;
  tenderedCash?: number;
  changeReturned?: number;
  items: ReceiptItem[];
  createdAt: string;
}

/**
 * Formats order data into standard 80mm (48-character width) thermal receipt text
 */
export function format80mmThermalReceipt(data: ReceiptData): string {
  const WIDTH = 48;
  const line = (char = '-') => char.repeat(WIDTH);
  const center = (text: string) => {
    const pad = Math.max(0, Math.floor((WIDTH - text.length) / 2));
    return ' '.repeat(pad) + text;
  };
  const row = (left: string, right: string) => {
    const space = Math.max(1, WIDTH - left.length - right.length);
    return left + ' '.repeat(space) + right;
  };

  const lines: string[] = [];

  // Header
  lines.push(center("================================================"));
  lines.push(center(config.shopName.toUpperCase()));
  lines.push(center("Dokan ERP, POS & Care Center"));
  lines.push(center(config.shopAddress));
  lines.push(center("Hotline: " + config.shopPhone));
  lines.push(center("================================================"));
  lines.push("");

  // Order Details
  lines.push(row(`INVOICE: ${data.orderId}`, `TYPE: ${data.orderSource}`));
  lines.push(row(`DATE: ${new Date(data.createdAt).toLocaleString('en-GB')}`, `CASHIER: ${data.cashierName || 'Staff'}`));
  lines.push(row(`CUSTOMER: ${data.customerName}`, `PHONE: ${data.customerPhone}`));
  lines.push(line('-'));

  // Items Header
  lines.push("ITEM DESCRIPTION         QTY   PRICE    TOTAL");
  lines.push(line('-'));

  // Items List
  data.items.forEach((item) => {
    let itemName = item.name;
    if (itemName.length > 22) {
      itemName = itemName.substring(0, 20) + '..';
    }
    const namePadded = itemName.padEnd(23, ' ');
    const qtyPadded = String(item.quantity).padStart(3, ' ');
    const pricePadded = item.unitPrice.toFixed(2).padStart(8, ' ');
    const totalPadded = item.totalPrice.toFixed(2).padStart(9, ' ');

    lines.push(`${namePadded} ${qtyPadded} ${pricePadded} ${totalPadded}`);
  });

  lines.push(line('='));

  // Financial Breakdown
  lines.push(row("SUBTOTAL:", `BDT ${data.subtotal.toFixed(2)}`));
  if (data.discountAmount > 0) {
    lines.push(row("DISCOUNT:", `-BDT ${data.discountAmount.toFixed(2)}`));
  }
  if (data.deliveryCharge > 0) {
    lines.push(row("DELIVERY CHARGE:", `+BDT ${data.deliveryCharge.toFixed(2)}`));
  }
  lines.push(line('-'));
  lines.push(row("NET PAYABLE:", `BDT ${data.totalAmount.toFixed(2)}`));
  lines.push(line('='));

  // Payment Breakdown
  lines.push(row("PAYMENT METHOD:", data.paymentMethod));
  if (data.tenderedCash !== undefined && data.tenderedCash !== null) {
    lines.push(row("TENDERED CASH:", `BDT ${Number(data.tenderedCash).toFixed(2)}`));
  }
  if (data.changeReturned !== undefined && data.changeReturned !== null) {
    lines.push(row("CHANGE RETURNED:", `BDT ${Number(data.changeReturned).toFixed(2)}`));
  }

  lines.push("");
  lines.push(center("--------------------------------"));
  lines.push(center("ধন্যবাদ! আবার আসবেন।"));
  lines.push(center("Software by CGI IT Company"));
  lines.push(center("--------------------------------"));
  lines.push("\n\n"); // Feed lines for cutter

  return lines.join('\n');
}
