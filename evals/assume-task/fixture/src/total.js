const SAVE10_MINIMUM = 10000;

export function subtotal(order) {
  return order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function discount(order, amount) {
  if (order.code === 'SAVE10' && amount >= SAVE10_MINIMUM) return Math.round(amount * 0.1);
  return 0;
}

export function total(order) {
  const amount = subtotal(order);
  return amount - discount(order, amount);
}
